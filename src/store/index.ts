import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import eventReducer from './slices/eventSlice';

const STORAGE_KEY = 'app_events';

export const store = configureStore({
  reducer: {
    events: eventReducer,
  },
});

store.subscribe(() => {
  const { events } = store.getState();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events.items));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
