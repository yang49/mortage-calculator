// Lightweight wrapper around GA4 gtag to avoid runtime checks everywhere
export type GAParams = Record<string, any>;

export function trackEvent(eventName: string, params: GAParams = {}) {
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    try {
      (window as any).gtag('event', eventName, params);
    } catch (e) {
      // no-op in case analytics is blocked
    }
  }
}
