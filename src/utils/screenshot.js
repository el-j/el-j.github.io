const SCREENSHOT_BASE = 'https://s0.wp.com/mshots/v1/'

export function buildScreenshotUrl(url, { width = 1200, height = 630 } = {}) {
  if (!url) return null
  try {
    const normalized = new URL(url, url.startsWith('http://') || url.startsWith('https://') ? undefined : 'https://')
    return `${SCREENSHOT_BASE}${encodeURIComponent(normalized.toString())}?w=${width}&h=${height}`
  } catch {
    return null
  }
}
