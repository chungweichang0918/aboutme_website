const headers = {
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'X-Frame-Options': 'DENY',
};
export const json = (data: object, status = 200, extra: Record<string, string> = {}) =>
  Response.json(data, { status, headers: { ...headers, ...extra } });

// Workers only supports manual or follow. Callers reject non-2xx responses.
export const requestOptions = { redirect: 'manual' as const, signal: () => AbortSignal.timeout(7000) };

export interface Context<Environment> { request: Request; env: Environment }
