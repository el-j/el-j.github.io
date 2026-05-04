const SCREENSHOT_BASE = 'https://s0.wp.com/mshots/v1/'

export function buildScreenshotUrl(url: string | null | undefined, { width = 1200, height = 630 }: { width?: number; height?: number } = {}): string | null {
  if (!url) return null
  try {
    const normalized = new URL(url, url.startsWith('http://') || url.startsWith('https://') ? undefined : 'https://')
    return `${SCREENSHOT_BASE}${encodeURIComponent(normalized.toString())}?w=${width}&h=${height}`
  } catch {
    return null
  }
}
