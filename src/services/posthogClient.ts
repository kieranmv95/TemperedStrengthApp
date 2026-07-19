/**
 * Non-React entry point for analytics capture.
 *
 * PostHog is wired from the provider via `registerPostHogCapture`, so sync and
 * other services can emit events without calling hooks.
 */

type AnalyticsPropertyValue = string | number | boolean | null;
type AnalyticsProperties = Record<string, AnalyticsPropertyValue>;

type CaptureFn = (event: string, properties?: AnalyticsProperties) => void;

let captureFn: CaptureFn | null = null;

export function registerPostHogCapture(capture: CaptureFn | null): void {
  captureFn = capture;
}

export function captureAnalyticsEvent(
  event: string,
  properties?: AnalyticsProperties
): void {
  if (!captureFn) return;
  try {
    captureFn(event, properties);
  } catch (error) {
    console.error('Failed to capture analytics event:', error);
  }
}
