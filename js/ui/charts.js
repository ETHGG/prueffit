// Lazy loading of the local Chart.js build (vendor/, no CDN) and theme-aware chart helpers.

let loading = null;

/** Loads ./vendor/chart.umd.min.js once and resolves with window.Chart. */
export function loadChartJs() {
  if (window.Chart) return Promise.resolve(window.Chart);
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = './vendor/chart.umd.min.js';
      script.async = true;
      script.onload = () => (window.Chart ? resolve(window.Chart) : reject(new Error('Chart.js missing')));
      script.onerror = () => { loading = null; reject(new Error('Chart.js could not be loaded')); };
      document.head.append(script);
    });
  }
  return loading;
}

/** Reads the app's CSS colour variables so charts follow light/dark mode. */
export function themeColors() {
  const css = getComputedStyle(document.documentElement);
  const v = (name) => css.getPropertyValue(name).trim();
  return {
    text: v('--text'),
    muted: v('--muted'),
    border: v('--border'),
    primary: v('--primary'),
    partial: v('--partial'),
    green: v('--light-green'),
    yellow: v('--light-yellow'),
    red: v('--light-red'),
    grey: v('--light-grey'),
  };
}

export const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
