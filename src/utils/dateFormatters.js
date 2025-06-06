export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date)
}

export const formatTimeOnly = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date)
}

export const formatDateOnly = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

export const getCurrentDate = () => {
  const now = new Date()
  return now.toISOString().split('T')[0]
}

export const getCurrentTime = () => {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

export const getDateRange = (filter) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  if (filter === 'today') {
    return {
      start: today.toISOString(),
      end: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
    }
  } else {
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    return {
      start: yesterday.toISOString(),
      end: today.toISOString()
    }
  }
}