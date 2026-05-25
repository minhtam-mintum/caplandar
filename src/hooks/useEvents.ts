import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'app_events';

export interface IEvent {
  id: string;
  name: string;
  start: number;
  end: number;
  alert: number;
  label: string;
  notes: string;
}

function loadEvents(): IEvent[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as IEvent[];
  } catch {
    // ignore parse errors
  }
  return [];
}

// Module-level store shared across all useEvents callers
let store: IEvent[] = loadEvents();
const subscribers = new Set<(events: IEvent[]) => void>();

function notify(next: IEvent[]) {
  store = next;
  subscribers.forEach((cb) => cb(next));
}

export function useEvents() {
  const [events, setEvents] = useState<IEvent[]>(() => store);

  useEffect(() => {
    subscribers.add(setEvents);
    return () => { subscribers.delete(setEvents); };
  }, []);

  const addEvent = useCallback((event: IEvent) => {
    const next = [...store, event];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    notify(next);
  }, []);

  const updateEvent = useCallback((id: string, event: IEvent) => {
    const next = store.map((e) => (e.id === id ? event : e));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    notify(next);
  }, []);

  return { events, addEvent, updateEvent };
}
