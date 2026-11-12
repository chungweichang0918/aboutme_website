import { json, requestOptions, type Context } from '../../_shared/http.ts';

interface Env {
  CMS_ORIGIN?: string;
  CMS_ALLOWED_LOGINS?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
}
const repo = 'chungweichang0918/aboutme_website';
const cookieName = '__Host-cwchang-oauth';
const handshake = 'authorizing:github';
const cookie = (value: string, age: number) => cookieName + '=' + value + '; Path=/; Max-Age=' + age + '; Secure; HttpOnly; SameSite=Lax';
const safe = (value: unknown) => JSON.stringify(value).replaceAll('<', '\\u003c');
const random = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) => byte.toString(16).padStart(2, '0')).join('');
const base64url = (value: ArrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(value))).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');

function result(origin: string, token?: string) {
  const nonce = random();
  const message = token
    ? 'authorization:github:success:' + JSON.stringify({ token, provider: 'github' })
    : 'authorization:github:error:' + JSON.stringify({ message: 'GitHub authorization could not be completed.' });
  const script = 'const parent = window.opener; const origin = ' + safe(origin) + ';' +
    'window.addEventListener("message", (event) => {' +
    'if (!parent || event.source !== parent || event.origin !== origin || event.data !== ' + safe(handshake) + ') return;' +
    'parent.postMessage(' + safe(message) + ', origin);' +
    '}); parent?.postMessage(' + safe(handshake) + ', origin);';
  return new Response('<!doctype html><html lang="en"><meta charset="utf-8"><title>GitHub authorization</title>' +
    '<p>' + (token ? 'Authorization complete. You can close this window.' : 'Authorization could not be completed.') + '</p>' +
    '<script nonce="' + nonce + '">' + script + '</script></html>', {
    headers: {
      'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store',
      'Set-Cookie': cookie('', 0), 'Referrer-Policy': 'no-referrer', 'X-Robots-Tag': 'noindex, nofollow',
      'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY',
      'Content-Security-Policy': "default-src 'none'; script-src 'nonce-" + nonce + "'; frame-ancestors 'none'; base-uri 'none'",
    },
  });
}

export async function onRequest({ request, env }: Context<Env>) {
  const url = new URL(request.url);
  const enabled = !!(url.protocol === 'https:' && env.CMS_ORIGIN === url.origin &&
    env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET && env.CMS_ALLOWED_LOGINS?.trim());
  if (request.method !== 'GET') return json({ error: 'method' }, 405, { Allow: 'GET' });
  if (url.pathname === '/api/auth/status') return json({ enabled });
  if (!enabled) return json({ error: 'unavailable' }, 503);
  const callback = url.origin + '/api/auth/callback';

  if (url.pathname === '/api/auth/login') {
    if (url.searchParams.get('provider') !== 'github' || url.searchParams.get('site_id') !== url.hostname) {
      return json({ error: 'request' }, 400);
    }
    const state = random();
    const verifier = random();
    const challenge = base64url(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)));
    const auth = new URL('https://github.com/login/oauth/authorize');
    auth.search = new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID!, redirect_uri: callback, state,
      scope: 'public_repo', code_challenge: challenge, code_challenge_method: 'S256',
    }).toString();
    return new Response(null, { status: 302, headers: {
      Location: auth.href, 'Set-Cookie': cookie(state + '.' + verifier, 600),
      'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer', 'X-Robots-Tag': 'noindex',
    } });
  }
  if (url.pathname !== '/api/auth/callback') return json({ error: 'not_found' }, 404);

  const stored = request.headers.get('Cookie')?.split(';').map((part) => part.trim()).find((part) => part.startsWith(cookieName + '='));
  const [expected, verifier] = (stored?.slice(cookieName.length + 1) ?? '').split('.');
  const code = url.searchParams.get('code');
  if (!/^[a-f0-9]{64}$/.test(expected) || !/^[a-f0-9]{64}$/.test(verifier) ||
    expected !== url.searchParams.get('state') || !code || code.length > 512) return result(url.origin);
  try {
    const exchange = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST', redirect: requestOptions.redirect, signal: requestOptions.signal(),
      headers: { Accept: 'application/json' },
      body: new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID!, client_secret: env.GITHUB_CLIENT_SECRET!, code,
        redirect_uri: callback, code_verifier: verifier,
      }),
    });
    if (!exchange.ok) return result(url.origin);
    const { access_token: token, scope } = await exchange.json() as { access_token?: string; scope?: string };
    const scopes = typeof scope === 'string' ? scope.split(/[\s,]+/) : [];
    if (typeof token !== 'string' || !token || !scopes.includes('public_repo') || scopes.includes('repo')) return result(url.origin);
    const get = (path: string) => fetch('https://api.github.com/' + path, {
      redirect: requestOptions.redirect, signal: requestOptions.signal(),
      headers: {
        Accept: 'application/vnd.github+json', Authorization: 'Bearer ' + token,
        'User-Agent': 'cwchang-pages-cms', 'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    const user = await get('user');
    if (!user.ok) return result(url.origin);
    const { login } = await user.json() as { login?: string };
    const allow = env.CMS_ALLOWED_LOGINS!.toLowerCase().split(',').map((name) => name.trim());
    if (typeof login !== 'string' || !allow.includes(login.toLowerCase())) return result(url.origin);
    const access = await get('repos/' + repo);
    if (!access.ok) return result(url.origin);
    const { private: isPrivate, permissions } = await access.json() as { private?: boolean; permissions?: { push?: boolean } };
    if (isPrivate !== false || permissions?.push !== true) return result(url.origin);
    return result(url.origin, token);
  } catch { return result(url.origin); }
}
