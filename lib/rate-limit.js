const ipMap = new Map()

export function rateLimit(ip, { max = 5, windowMs = 60000 } = {}) {
  const now = Date.now()
  const entry = ipMap.get(ip)

  if (!entry || now - entry.start > windowMs) {
    ipMap.set(ip, { start: now, count: 1 })
    return { allowed: true, remaining: max - 1 }
  }

  if (entry.count >= max) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: max - entry.count }
}

setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of ipMap) {
    if (now - entry.start > 60000) ipMap.delete(ip)
  }
}, 60000)
