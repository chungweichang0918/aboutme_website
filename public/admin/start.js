const status = document.querySelector('#cms-status');
const disabled = () => { status.textContent = 'GitHub 登入尚未啟用。請依部署指南完成 OAuth 設定。'; };
async function start() {
  const local = window.localCms && ['localhost','127.0.0.1'].includes(location.hostname);
  if (!local) {
    try {
      const response = await fetch('/api/auth/status', { cache: 'no-store' });
      if (!response.ok || !(await response.json()).enabled) return disabled();
    } catch { return disabled(); }
  }
  const script = document.createElement('script');
  script.src = '/admin/assets/decap-cms.js';
  script.onload = () => status.remove();
  script.onerror = disabled;
  document.head.append(script);
}
void start();
