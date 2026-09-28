// Admin session. The access token lives only in memory (never localStorage); the refresh token
// is an httpOnly cookie the browser sends to /api/auth/* on its own.
import { useSyncExternalStore } from 'react';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { LoginInput } from '@portfolio/shared';
import { apiClient } from './client';

let accessToken: string | null = null;
let refreshing: Promise<boolean> | null = null;
const listeners = new Set<() => void>();

function setAccessToken(token: string | null) {
  accessToken = token;
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => {
    listeners.delete(notify);
  };
}

export function useIsAuthenticated(): boolean {
  return useSyncExternalStore(subscribe, () => accessToken !== null);
}

export async function login(input: LoginInput): Promise<void> {
  const { data } = await apiClient.post('/auth/login', input);
  setAccessToken(data.data.accessToken);
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
  } finally {
    setAccessToken(null);
  }
}

/** Trades the refresh cookie for a new access token. Concurrent callers share one request. */
export function refreshSession(): Promise<boolean> {
  refreshing ??= apiClient
    .post('/auth/refresh')
    .then(
      ({ data }) => {
        setAccessToken(data.data.accessToken);
        return true;
      },
      () => {
        setAccessToken(null);
        return false;
      },
    )
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

const isAuthCall = (config?: InternalAxiosRequestConfig) => config?.url?.startsWith('/auth/');

apiClient.interceptors.request.use((config) => {
  if (accessToken && !isAuthCall(config)) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// Access token expired mid-session → refresh once and replay the request.
apiClient.interceptors.response.use(undefined, async (error: AxiosError) => {
  const config = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;
  if (error.response?.status !== 401 || !config || config._retried || isAuthCall(config)) {
    throw error;
  }
  config._retried = true;
  if (!(await refreshSession())) throw error;
  return apiClient(config);
});
