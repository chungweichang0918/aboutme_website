try {
  const root = document.documentElement;
  const theme = localStorage.getItem('appearance') || root.dataset.defaultTheme;
  if (theme === 'dark' || theme === 'light') root.dataset.theme = theme;
} catch {
  // The system preference still applies if storage is unavailable.
}
