import dayjs from './dayjs'

export const formatDate = (dateString) => {
  return dayjs(dateString).format('D [de] MMMM [de] YYYY, h:mm a')
}

export const formatTimeOnly = (dateString) => {
  return dayjs(dateString).format('h:mm a')
}

export const formatDateOnly = (dateString) => {
  return dayjs(dateString).format('D [de] MMMM [de] YYYY')
}

export const getCurrentDate = () => {
  return dayjs().format('YYYY-MM-DD')
}

export const getCurrentTime = () => {
  return dayjs().format('HH:mm')
}

export const startOfDay = (dateString) => {
  return dayjs(dateString).startOf('day').toISOString()
}

export const endOfDay = (dateString) => {
  return dayjs(dateString).endOf('day').toISOString()
}

export const toLocalDate = (dateString) => {
  return dayjs(dateString).local()
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