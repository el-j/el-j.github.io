const SCREENSHOT_BASE = 'https://s0.wp.com/mshots/v1/'

export function buildScreenshotUrl(url, { width = 1200, height = 630 } = {}) {
  if (!url) return null
  const normalized = url.startsWith('http') ? url : `https://${url}`
  return `${SCREENSHOT_BASE}${encodeURIComponent(normalized)}?w=${width}&h=${height}`
}
