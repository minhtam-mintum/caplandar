import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { clearTokens, initTokens, type IUser } from 'app/services/api';

export const AUTH_STORAGE_KEY = 'app_auth';

interface IAuthState {
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAnonymous: boolean;
}

interface ISetAuthPayload {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

function loadAuth(): IAuthState {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return { user: null, accessToken: null, refreshToken: null, isAnonymous: false };
    const parsed = JSON.parse(stored) as IAuthState;
    if (parsed.isAnonymous) {
      return { user: null, accessToken: null, refreshToken: null, isAnonymous: true };
    }
    if (parsed.user && parsed.accessToken && parsed.refreshToken) {
      initTokens(parsed.accessToken, parsed.refreshToken);
      return parsed;
    }
  } catch {}
  return { user: null, accessToken: null, refreshToken: null, isAnonymous: false };
}

const authSlice = createSlice({
  name: 'auth',
  initialState: loadAuth(),
  reducers: {
    setAuth: (state, action: PayloadAction<ISetAuthPayload>) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAnonymous = false;
    },
    setAnonymous: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAnonymous = true;
      clearTokens();
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAnonymous = false;
      clearTokens();
    },
    updateTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
  },
});

export const { setAuth, setAnonymous, logout, updateTokens } = authSlice.actions;
export default authSlice.reducer;
