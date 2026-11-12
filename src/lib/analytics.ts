// Cloudflare Web Analytics beacon ID (public, 32 hex characters), read at build time.
const token = process.env.CLOUDFLARE_ANALYTICS_TOKEN;
export const analyticsToken = token && /^[0-9a-f]{32}$/i.test(token) ? token : undefined;
