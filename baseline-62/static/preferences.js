try {
  const preferences = JSON.parse(localStorage.getItem('pulse-preferences') || 'null');
  if (preferences?.theme === 'light' || preferences?.theme === 'dark') {
    document.documentElement.dataset.theme = preferences.theme;
  }
} catch { /* Invalid or unavailable local preferences must not prevent rendering. */ }
