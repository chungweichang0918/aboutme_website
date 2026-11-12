import { json, requestOptions, type Context } from '../_shared/http.ts';

interface Env {
  CONTACT_ORIGIN?: string;
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET?: string;
  RESEND_API_KEY?: string;
  CONTACT_FROM?: string;
  CONTACT_TO?: string;
  CONTACT_LIMITER?: { fetch(request: Request): Promise<Response> };
}
const configured = (env: Env, request: Request) => {
  const siteKey = env.TURNSTILE_SITE_KEY;
  return env.CONTACT_ORIGIN === new URL(request.url).origin &&
    !!siteKey && !!(env.TURNSTILE_SECRET && env.RESEND_API_KEY && env.CONTACT_FROM && env.CONTACT_TO && env.CONTACT_LIMITER) &&
    !siteKey.startsWith('re_') && siteKey !== env.TURNSTILE_SECRET && siteKey !== env.RESEND_API_KEY;
};
const reject = (code: string, status: number, extra?: Record<string, string>) => json({ code }, status, extra);
const siteverifyCodes = ['invalid-input-secret', 'missing-input-secret', 'invalid-input-response',
  'missing-input-response', 'bad-request', 'timeout-or-duplicate', 'internal-error'];
const rejectedToken = ['invalid-input-response', 'missing-input-response', 'timeout-or-duplicate'];
const emailPattern = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;
const idPattern = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
const limitBytes = 24000;

async function readJson(request: Request): Promise<Record<string, unknown>> {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('Missing body');
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let text = '';
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limitBytes) { await reader.cancel(); throw new Error('Request too large'); }
      text += decoder.decode(value, { stream: true });
    }
    const data: unknown = JSON.parse(text + decoder.decode());
    if (typeof data !== 'object' || data === null || Array.isArray(data)) throw new Error('Invalid JSON');
    return data as Record<string, unknown>;
  } finally { reader.releaseLock(); }
}

export async function onRequest({ request, env }: Context<Env>) {
  if (request.method === 'GET') return json({ siteKey: configured(env, request) ? env.TURNSTILE_SITE_KEY : null });
  if (request.method !== 'POST') return reject('invalid', 405, { Allow: 'GET, POST' });
  if (!configured(env, request)) return reject('off', 503);
  if (request.headers.get('Origin') !== env.CONTACT_ORIGIN || request.headers.get('Sec-Fetch-Site') === 'cross-site') return reject('invalid', 403);
  if (request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return reject('invalid', 415);
  if (Number(request.headers.get('Content-Length')) > limitBytes) return reject('invalid', 413);

  let stage = 'rate-limit';
  try {
    const ip = request.headers.get('CF-Connecting-IP');
    if (!ip || ip.length > 64) return reject('error', 503);
    const rate = await env.CONTACT_LIMITER!.fetch(new Request('https://contact-limiter.internal/', { method: 'POST', body: ip }));
    if (rate.status === 429) return reject('rate', 429, { 'Retry-After': '60' });
    if (rate.status !== 204) {
      console.warn('contact.rate-limit', rate.status);
      return reject('error', 503);
    }

    let payload: Record<string, unknown>;
    try { payload = await readJson(request); }
    catch { return reject('invalid', 400); }
    const field = (key: string) => {
      const value = payload[key];
      return typeof value === 'string' ? value.trim() : '';
    };
    const name = field('name'), email = field('email'), subject = field('subject'), message = field('message');
    const token = field('token'), requestId = field('requestId');
    if (!name || name.length > 100 || email.length > 254 || !emailPattern.test(email) ||
      !subject || subject.length > 140 || /[\u0000-\u001f\u007f]/.test(name + subject + email) ||
      !message || message.length > 4000 || !idPattern.test(requestId)) return reject('invalid', 400);
    if (!token || token.length > 2048) return reject('challenge', 400);

    stage = 'siteverify';
    const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', redirect: requestOptions.redirect, signal: requestOptions.signal(),
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET!, response: token, remoteip: ip }),
    });
    const result = await verification.json() as { success?: boolean; hostname?: string; action?: string; 'error-codes'?: unknown };
    const codes = result['error-codes'];
    const knownCodes = Array.isArray(codes) ? siteverifyCodes.filter((code) => codes.includes(code)) : [];
    if (knownCodes.length && knownCodes.every((code) => rejectedToken.includes(code))) return reject('challenge', 403);
    if (!verification.ok || knownCodes.length > 0) {
      console.warn('contact.siteverify', verification.status, ...knownCodes);
      return reject('error', 503);
    }
    if (!result.success || result.hostname !== new URL(env.CONTACT_ORIGIN!).hostname || result.action !== 'contact') return reject('challenge', 403);

    stage = 'resend';
    const keyHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify([requestId, name, email, subject, message])));
    const idempotency = Array.from(new Uint8Array(keyHash), (byte) => byte.toString(16).padStart(2, '0')).join('');
    const delivery = await fetch('https://api.resend.com/emails', {
      method: 'POST', redirect: requestOptions.redirect, signal: requestOptions.signal(),
      headers: { Authorization: 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json', 'Idempotency-Key': 'contact/' + idempotency },
      body: JSON.stringify({
        from: env.CONTACT_FROM, to: [env.CONTACT_TO], reply_to: email,
        subject: '[cwchang.me] ' + subject, text: name + ' <' + email + '>\n\n' + message,
      }),
    });
    if (!delivery.ok) {
      console.warn('contact.resend', delivery.status);
      return reject('error', 502);
    }
    return json({ code: 'sent' });
  } catch {
    console.warn('contact.' + stage, 'request-failed');
    return reject('error', 503);
  }
}
