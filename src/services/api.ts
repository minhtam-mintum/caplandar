const BASE_URL = 'https://caplandar-api.onrender.com/api';

export interface IUser {
  _id: string;
  userId: string;
  name: string;
}

let _accessToken: string | null = null;
let _refreshToken: string | null = null;
let _refreshPromise: Promise<void> | null = null;

export function initTokens(accessToken: string, refreshToken: string) {
  _accessToken = accessToken;
  _refreshToken = refreshToken;
}

export function clearTokens() {
  _accessToken = null;
  _refreshToken = null;
}

async function doRefresh(): Promise<void> {
  if (!_refreshToken) throw new Error('No refresh token');
  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: _refreshToken }),
  });
  if (!res.ok) {
    clearTokens();
    throw new Error('Session expired');
  }
  const data = (await res.json()) as { accessToken: string; refreshToken: string };
  _accessToken = data.accessToken;
  _refreshToken = data.refreshToken;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) ?? {}),
  };
  if (_accessToken) headers['Authorization'] = `Bearer ${_accessToken}`;

  let res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401 && _refreshToken) {
    if (!_refreshPromise) {
      _refreshPromise = doRefresh().finally(() => {
        _refreshPromise = null;
      });
    }
    try {
      await _refreshPromise;
      if (_accessToken) headers['Authorization'] = `Bearer ${_accessToken}`;
      res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
    } catch {
      throw new Error('Session expired. Please log in again.');
    }
  }

  if (!res.ok) {
    let message = 'Request failed';
    try {
      const body = (await res.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {}
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

export async function apiRegister(userId: string, password: string, name: string) {
  return request<{ message: string; user: IUser }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ userId, password, name }),
  });
}

export async function apiLogin(userId: string, password: string) {
  const data = await request<{ accessToken: string; refreshToken: string; user: IUser }>(
    '/auth/login',
    { method: 'POST', body: JSON.stringify({ userId, password }) },
  );
  initTokens(data.accessToken, data.refreshToken);
  return data;
}
