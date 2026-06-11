import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IApiEvent } from 'app/services/api';
import { apiCreateEvent, apiGetEvents } from 'app/services/api';

import { setAuth, logout, setAnonymous } from './authSlice';

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
  loading: boolean;
  fetchedYears: number[];
}

// ─── Mapping helpers ──────────────────────────────────────────────────────────

function resolveLabelId(labelId: string | { _id: string } | undefined): string {
  if (!labelId) return '';
  return typeof labelId === 'string' ? labelId : labelId._id;
}

function mapApiEventToLocal(apiEvent: IApiEvent): IEvent {
  return {
    id: apiEvent._id,
    name: apiEvent.title,
    start: new Date(apiEvent.startDate).getTime(),
    end: new Date(apiEvent.endDate).getTime(),
    alert: 0,
    label: resolveLabelId(apiEvent.labelId),
    notes: apiEvent.description ?? '',
  };
}

export function mapLocalToApiPayload(event: Omit<IEvent, 'id'>) {
  return {
    title: event.name,
    startDate: new Date(event.start).toISOString(),
    endDate: new Date(event.end).toISOString(),
    labelId: event.label || undefined,
    description: event.notes || undefined,
    allDay: false as const,
  };
}

// ─── Thunks ───────────────────────────────────────────────────────────────────

type AuthSliceState = { user: { _id: string } | null; isAnonymous: boolean };

interface IFetchEventsResult {
  events: IEvent[];
  year: number;
}

export const fetchEventsThunk = createAsyncThunk<
  IFetchEventsResult,
  { from: string; to: string },
  { state: { auth: AuthSliceState; events: IEventState } }
>(
  'events/fetch',
  async (params) => {
    const year = parseInt(params.from.slice(0, 4), 10);
    const apiEvents = await apiGetEvents(params);
    return { events: apiEvents.map(mapApiEventToLocal), year };
  },
  {
    condition: (params, { getState }) => {
      const { auth, events } = getState();
      if (!auth.user || auth.isAnonymous) return false;
      const year = parseInt(params.from.slice(0, 4), 10);
      return !events.fetchedYears.includes(year);
    },
  },
);

export const createEventThunk = createAsyncThunk<
  IEvent,
  Omit<IEvent, 'id'>,
  { state: { auth: AuthSliceState } }
>('events/create', async (data, { getState }) => {
  const { auth } = getState();
  if (!auth.user || auth.isAnonymous) {
    return { id: crypto.randomUUID(), ...data };
  }
  const apiEvent = await apiCreateEvent(mapLocalToApiPayload(data));
  return mapApiEventToLocal(apiEvent);
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState: IEventState = {
  items: [],
  loading: false,
  fetchedYears: [],
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
  extraReducers: (builder) => {
    builder
      .addCase(setAuth, (state) => {
        state.items = [];
        state.fetchedYears = [];
      })
      .addCase(logout, (state) => {
        state.items = [];
        state.fetchedYears = [];
      })
      .addCase(setAnonymous, (state) => {
        state.items = [];
        state.fetchedYears = [];
      })
      .addCase(fetchEventsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEventsThunk.fulfilled, (state, action) => {
        const { events, year } = action.payload;
        state.items = [
          ...state.items.filter((e) => new Date(e.start).getFullYear() !== year),
          ...events,
        ];
        state.fetchedYears.push(year);
        state.loading = false;
      })
      .addCase(fetchEventsThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createEventThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export const { addEvent, updateEvent, removeEvent } = eventSlice.actions;
export default eventSlice.reducer;
