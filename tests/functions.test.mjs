import assert from 'node:assert/strict';
import { test } from 'node:test';
import { onRequest as contact } from '../functions/api/contact.ts';
import { onRequest as oauth } from '../functions/api/auth/[action].ts';

const origin = 'https://cwchang.me';
const env = {
  CONTACT_ORIGIN: origin, TURNSTILE_SITE_KEY: 'fixture-site', TURNSTILE_SECRET: 'fixture-secret',
  RESEND_API_KEY: 'fixture-mail', CONTACT_FROM: 'website@fixture.example', CONTACT_TO: 'owner@fixture.example',
  CONTACT_LIMITER: { fetch: async () => new Response(null, { status: 204 }) },
};
const payload = {
  name: 'Fixture', email: 'visitor@fixture.example', subject: 'Test', message: 'Fixture message',
  requestId: 'ae36b999-9aa9-4120-8ec6-882349af775e', token: 'fixture-turnstile',
};
function submit(data = payload, headers = {}, bindings = env) {
  return contact({ env: bindings, request: new Request(origin + '/api/contact', {
    method:'POST', headers: { Origin:origin, 'Content-Type':'application/json', 'CF-Connecting-IP':'192.0.2.1', ...headers },
    body: typeof data === 'string' ? data : JSON.stringify(data),
  }) });
}
test('contact defaults off and exposes only the public site key when configured', async () => {
  const request = new Request(origin + '/api/contact');
  assert.deepEqual(await (await contact({request, env:{}})).json(), {siteKey:null});
  assert.deepEqual(await (await contact({request, env})).json(), {siteKey:'fixture-site'});
  assert.equal((await submit(payload, {}, {})).status, 503);
});
test('rejects cross-origin, missing fields, invalid email, invalid JSON, and oversized bodies', async () => {
  assert.equal((await submit(payload, {Origin:'https://other.example'})).status, 403);
  assert.equal((await submit(payload, {'Content-Type':'text/plain'})).status, 415);
  assert.equal((await submit({ ...payload, message:'' })).status, 400);
  assert.equal((await submit({ ...payload, email:'invalid' })).status, 400);
  assert.equal((await submit('invalid json')).status, 400);
  assert.equal((await submit({ ...payload, message:'x'.repeat(4001) })).status, 400);
  assert.equal((await submit({ ...payload, message:'x'.repeat(25000) })).status, 400);
});
test('limits submissions before calling verification or mail delivery', async () => {
  const limited = { ...env, CONTACT_LIMITER:{ fetch:async () => new Response(null, {status:429}) } };
  const response = await submit(payload, {}, limited);
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('Retry-After'), '60');
});
test('verifies hostname, action and single-use tokens and retries with the same delivery key', async (t) => {
  const keys = [];
  let mode = 'good';
  let badDelivery = true;
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    if (url.includes('/siteverify')) return Response.json({
      success: mode !== 'replayed', hostname: mode === 'other-host' ? 'other.example' : 'cwchang.me',
      action: mode === 'other-action' ? 'other' : 'contact',
    });
    assert.equal(url, 'https://api.resend.com/emails');
    keys.push(options.headers['Idempotency-Key']);
    const body = JSON.parse(options.body);
    assert.equal(body.reply_to, payload.email);
    assert(!('html' in body));
    return Response.json({}, {status:badDelivery ? 500 : 200});
  });
  for (mode of ['other-host','other-action','replayed']) assert.equal((await submit()).status, 403);
  assert.equal(keys.length, 0);
  mode = 'good';
  assert.equal((await submit()).status, 502);
  badDelivery = false;
  assert.equal((await submit({...payload,token:'fresh-token'})).status, 200);
  assert.equal(keys[0], keys[1]);
});
const authEnv = { CMS_ORIGIN:origin, CMS_ALLOWED_LOGINS:'chungweichang0918', GITHUB_CLIENT_ID:'fixture-id', GITHUB_CLIENT_SECRET:'fixture-secret' };
const auth = (path, env = authEnv, cookie = '') => oauth({
  env, request: new Request(origin + '/api/auth/' + path, {headers:{Cookie:cookie}}),
});
test('OAuth disables itself without secrets, accepts its exact hostname and requires state', async (t) => {
  const fetchMock = t.mock.method(globalThis, 'fetch', async () => { throw new Error('unexpected request'); });
  assert.deepEqual(await (await auth('status',{})).json(), {enabled:false});
  assert.equal((await auth('login?provider=github&site_id=other.example')).status, 400);
  const login = await auth('login?provider=github&site_id=cwchang.me');
  assert.equal(login.status, 302);
  assert.match(login.headers.get('Set-Cookie'), /Secure; HttpOnly; SameSite=Lax/);
  const target = new URL(login.headers.get('Location'));
  assert.equal(target.origin, 'https://github.com');
  assert.equal(target.searchParams.get('code_challenge_method'), 'S256');
  assert.equal(target.searchParams.get('scope'), 'public_repo');
  const wrong = await auth('callback?code=fixture-code&state=bad', authEnv, login.headers.get('Set-Cookie').split(';')[0]);
  assert.match(await wrong.text(), /authorization:github:error/);
  assert.equal(fetchMock.mock.callCount(), 0);
});
test('OAuth releases the token only after account allowlist and repository write checks', async (t) => {
  let loginName = 'other-account';
  let write = false;
  t.mock.method(globalThis, 'fetch', async (url) => {
    if (url.endsWith('/access_token')) return Response.json({access_token:'fixture-only-token', scope:'public_repo'});
    if (url.endsWith('/user')) return Response.json({login:loginName});
    assert(url.endsWith('/repos/chungweichang0918/aboutme_website'));
    return Response.json({private:false,permissions:{push:write}});
  });
  async function callback() {
    const login = await auth('login?provider=github&site_id=cwchang.me');
    const { searchParams } = new URL(login.headers.get('Location'));
    const response = await auth('callback?code=fixture-code&state=' + searchParams.get('state'), authEnv, login.headers.get('Set-Cookie').split(';')[0]);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
    assert.match(response.headers.get('Set-Cookie'), /Max-Age=0/);
    return response.text();
  }
  assert.doesNotMatch(await callback(), /fixture-only-token/);
  loginName = 'chungweichang0918';
  assert.doesNotMatch(await callback(), /fixture-only-token/);
  write = true;
  const html = await callback();
  assert.match(html, /authorization:github:success/);
  assert.match(html, /event\.source !== parent \|\| event\.origin !== origin/);
  assert.doesNotMatch(html, /fixture-secret/);
});
