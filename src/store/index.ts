import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import eventReducer from './slices/eventSlice';
import notificationReducer, { NOTIFICATION_READ_KEY } from './slices/notificationSlice';
import authReducer, { AUTH_STORAGE_KEY } from './slices/authSlice';

const STORAGE_KEY = 'app_events';

export const store = configureStore({
  reducer: {
    events: eventReducer,
    notifications: notificationReducer,
    auth: authReducer,
  },
});

store.subscribe(() => {
  const { events, notifications, auth } = store.getState();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events.items));
  localStorage.setItem(NOTIFICATION_READ_KEY, JSON.stringify(notifications.readIds));
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
