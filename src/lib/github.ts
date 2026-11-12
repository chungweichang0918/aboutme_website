import { settings } from './settings';

interface PublicActivity { repos: number; events: number }
let activity: Promise<PublicActivity | null> | undefined;

export function githubPublicActivity() {
  if (process.env.GITHUB_PUBLIC_ACTIVITY !== '1') return Promise.resolve(null);
  activity ??= load();
  return activity;
}

async function load(): Promise<PublicActivity | null> {
  const profile = new URL(settings.github);
  if (profile.hostname !== 'github.com' || !/^\/[\w-]+\/?$/.test(profile.pathname)) return null;
  const endpoint = 'https://api.github.com/users' + profile.pathname.replace(/\/$/, '');
  const get = (url: string) => fetch(url, {
    redirect: 'error', signal: AbortSignal.timeout(4500),
    headers: { 'User-Agent': 'cwchang-me', Accept: 'application/vnd.github+json' },
  });
  try {
    const [user, events] = await Promise.all([get(endpoint), get(endpoint + '/events/public?per_page=30')]);
    if (!user.ok || !events.ok) return null;
    const info = await user.json() as { public_repos?: number };
    const recent: unknown = await events.json();
    if (!Number.isInteger(info.public_repos) || !Array.isArray(recent)) return null;
    return { repos: info.public_repos!, events: recent.length };
  } catch { return null; }
}
