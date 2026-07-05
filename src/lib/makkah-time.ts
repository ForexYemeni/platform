// ============================================
// Makkah Time Zone (UTC+3) Utilities
// ============================================

export const MAKKAH_TIMEZONE = 'Asia/Riyadh' // Same as Makkah (UTC+3)

/**
 * Get current time in Makkah timezone (UTC+3)
 * Simple, reliable method - just add 3 hours to UTC
 */
export function getMakkahNow(): Date {
  const now = new Date()
  // Makkah is UTC+3. Get UTC time and add 3 hours.
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000
  return new Date(utcMs + 3 * 3600000)
}

/**
 * Get Makkah hour (0-23)
 */
export function getMakkahHour(): number {
  return parseInt(new Date().toLocaleString('en-US', {
    timeZone: MAKKAH_TIMEZONE,
    hour: 'numeric',
    hour12: false
  }))
}

/**
 * Format date in Makkah time with 12-hour format (AM/PM)
 */
export function formatMakkahTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('en-US', {
    timeZone: MAKKAH_TIMEZONE,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

/**
 * Format date in Makkah time (date only)
 */
export function formatMakkahDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    timeZone: MAKKAH_TIMEZONE,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format time only in 12-hour format (e.g., "2:30 PM")
 */
export function formatTime12(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('en-US', {
    timeZone: MAKKAH_TIMEZONE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

/**
 * Get hour in 12-hour format with AM/PM label
 * Returns: { hour: number (1-12), period: 'AM' | 'PM', label: string }
 */
export function getHour12(hour24: number): { hour: number, period: 'AM' | 'PM', label: string } {
  const period = hour24 < 12 || hour24 === 24 ? 'AM' : 'PM'
  let hour12 = hour24 % 12
  if (hour12 === 0) hour12 = 12
  return {
    hour: hour12,
    period,
    label: `${hour12}:00 ${period}`,
  }
}

/**
 * Convert 12-hour format to 24-hour
 */
export function to24Hour(hour12: number, period: 'AM' | 'PM'): number {
  if (period === 'AM') {
    return hour12 === 12 ? 0 : hour12
  } else {
    return hour12 === 12 ? 12 : hour12 + 12
  }
}

/**
 * Get time remaining until a specific date in Makkah time
 */
export function getTimeRemaining(expiresAt: Date | string): {
  hours: number,
  minutes: number,
  seconds: number,
  total: number,
  percent: number,
  totalDuration: number,
} {
  const now = getMakkahNow().getTime()
  const expires = new Date(expiresAt).getTime()
  const total = expires - now

  if (total <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, total: 0, percent: 100, totalDuration: 0 }
  }

  const hours = Math.floor(total / (1000 * 60 * 60))
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (60 * 1000))
  const seconds = Math.floor((total % (60 * 1000)) / 1000)

  return {
    hours,
    minutes,
    seconds,
    total,
    percent: 0, // Will be calculated by caller
    totalDuration: 0,
  }
}

/**
 * Calculate mining end time based on start time and duration
 * Uses Makkah timezone
 */
export function calculateMiningEndTime(startHour: number, durationHours: number): { start: Date, end: Date } {
  const now = getMakkahNow()
  const start = new Date(now)

  // Set start hour
  start.setHours(startHour, 0, 0, 0)

  // If start hour is in the future today, use today
  // If it's already passed, it's fine - mining starts now and ends at start + duration
  // Actually, if the start time has passed today, we start now
  if (start.getTime() < now.getTime()) {
    // Start time already passed today, start now
    start.setTime(now.getTime())
  }

  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000)

  return { start, end }
}
