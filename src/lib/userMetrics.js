const STORAGE_KEY = 'vnr202-user-metrics'
const SESSION_VISIT_GUARD_KEY = 'vnr202-visit-recorded'

const createInitialMetrics = () => ({
  totalVisits: 0,
  visitsByDay: {},
  gameStarts: 0,
  chatMessagesSent: 0,
  lastActiveAt: null,
})

const getTodayKey = () => {
  const now = new Date()
  const month = `${now.getMonth() + 1}`.padStart(2, '0')
  const day = `${now.getDate()}`.padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

const loadMetrics = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return createInitialMetrics()
    }

    const parsed = JSON.parse(raw)
    return {
      ...createInitialMetrics(),
      ...parsed,
      visitsByDay: typeof parsed?.visitsByDay === 'object' && parsed.visitsByDay ? parsed.visitsByDay : {},
    }
  } catch {
    return createInitialMetrics()
  }
}

const saveMetrics = (metrics) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics))
}

const patchMetrics = (updater) => {
  const current = loadMetrics()
  const next = updater(current)
  saveMetrics(next)
  return next
}

export const getUserMetrics = () => {
  const metrics = loadMetrics()
  const todayKey = getTodayKey()

  return {
    ...metrics,
    visitsToday: metrics.visitsByDay[todayKey] || 0,
  }
}

export const recordVisit = () => {
  if (sessionStorage.getItem(SESSION_VISIT_GUARD_KEY) === '1') {
    return getUserMetrics()
  }

  sessionStorage.setItem(SESSION_VISIT_GUARD_KEY, '1')

  return patchMetrics((metrics) => {
    const todayKey = getTodayKey()
    const visitsToday = (metrics.visitsByDay[todayKey] || 0) + 1

    return {
      ...metrics,
      totalVisits: metrics.totalVisits + 1,
      visitsByDay: {
        ...metrics.visitsByDay,
        [todayKey]: visitsToday,
      },
      lastActiveAt: Date.now(),
    }
  })
}

export const recordChatMessage = () => {
  return patchMetrics((metrics) => ({
    ...metrics,
    chatMessagesSent: metrics.chatMessagesSent + 1,
    lastActiveAt: Date.now(),
  }))
}

export const recordGameStart = () => {
  return patchMetrics((metrics) => ({
    ...metrics,
    gameStarts: metrics.gameStarts + 1,
    lastActiveAt: Date.now(),
  }))
}
