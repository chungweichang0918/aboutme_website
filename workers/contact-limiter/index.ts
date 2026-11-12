interface Env {
  CONTACT_RATE: { limit(options: { key: string }): Promise<{ success: boolean }> };
}
export default {
  async fetch(request: Request, env: Env) {
    if (request.method !== 'POST') return new Response(null, { status: 405 });
    const ip = await request.text();
    if (!/^[0-9a-f:.]{3,64}$/i.test(ip)) return new Response(null, { status: 400 });
    const { success } = await env.CONTACT_RATE.limit({ key: ip });
    return new Response(null, { status: success ? 204 : 429 });
  },
};
