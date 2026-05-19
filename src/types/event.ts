export type EventVariant = 'primary' | 'secondary' | 'tertiary' | 'surface'
export type TagVariant = 'error' | 'primary' | 'secondary' | 'tertiary'

export interface CalendarEvent {
  id: string
  title: string
  date: string       // YYYY-MM-DD
  startTime: string  // HH:MM
  endTime: string    // HH:MM
  variant?: EventVariant
}

export interface DayCalendarEvent extends CalendarEvent {
  description?: string
  duration?: string    // e.g. "1h 30m"
  attendees?: string
  tag?: string
  tagVariant?: TagVariant
  isPill?: boolean
}
