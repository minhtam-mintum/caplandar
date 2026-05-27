import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface IEvent {
  id: string;
  name: string;
  start: number;
  end: number;
  alert: number;
  label: string;
  notes: string;
}

interface IEventState {
  items: IEvent[];
}

export const EVENT_STORAGE_KEY = 'app_events';

function loadEvents(): IEvent[] {
  try {
    const stored = localStorage.getItem(EVENT_STORAGE_KEY);
    if (stored) return JSON.parse(stored) as IEvent[];
  } catch {
    // ignore parse errors
  }
  return [];
}

const initialState: IEventState = {
  items: loadEvents(),
};

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<IEvent>) => {
      state.items.push(action.payload);
    },
    updateEvent: (state, action: PayloadAction<IEvent>) => {
      const index = state.items.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    removeEvent: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((e) => e.id !== action.payload);
    },
  },
});

export const { addEvent, updateEvent, removeEvent } = eventSlice.actions;
export default eventSlice.reducer;
