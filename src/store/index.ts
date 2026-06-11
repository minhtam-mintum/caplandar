import { configureStore, type Middleware } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import eventReducer, { updateEvent, removeEvent, mapLocalToApiPayload } from './slices/eventSlice';
import notificationReducer, { NOTIFICATION_READ_KEY } from './slices/notificationSlice';
import authReducer, { AUTH_STORAGE_KEY, updateTokens } from './slices/authSlice';
import { apiUpdateEvent, apiDeleteEvent, setOnTokensRefreshed } from 'app/services/api';

type SyncState = {
  auth: { user: { _id: string } | null; isAnonymous: boolean };
};

const apiSyncMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  const result = next(action);
  const state = storeAPI.getState() as SyncState;

  if (!state.auth.user || state.auth.isAnonymous) return result;

  if (updateEvent.match(action)) {
    apiUpdateEvent(action.payload.id, mapLocalToApiPayload(action.payload)).catch(console.error);
  }
  if (removeEvent.match(action)) {
    apiDeleteEvent(action.payload as string).catch(console.error);
  }

  return result;
};

export const store = configureStore({
  reducer: {
    events: eventReducer,
    notifications: notificationReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSyncMiddleware),
});

setOnTokensRefreshed(({ accessToken, refreshToken }) => {
  store.dispatch(updateTokens({ accessToken, refreshToken }));
});

store.subscribe(() => {
  const { notifications, auth } = store.getState();
  localStorage.setItem(NOTIFICATION_READ_KEY, JSON.stringify(notifications.readIds));
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
