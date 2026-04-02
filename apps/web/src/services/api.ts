import type { ScanRequest, ScanResponse, StrategyRecord } from '@gate-screener/shared-types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    ...init
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as
      | { error?: { message?: string } }
      | null;
    throw new Error(errorBody?.error?.message ?? `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const scanMarket = (request: ScanRequest, signal?: AbortSignal): Promise<ScanResponse> =>
  requestJson<ScanResponse>('/api/scan', {
    method: 'POST',
    signal,
    body: JSON.stringify(request)
  });

export const listStrategies = async (): Promise<StrategyRecord[]> => {
  const response = await requestJson<{ data: StrategyRecord[] }>('/api/strategies');
  return response.data;
};

export const saveStrategy = async (name: string, request: ScanRequest): Promise<StrategyRecord> => {
  const response = await requestJson<{ data: StrategyRecord }>('/api/strategies', {
    method: 'POST',
    body: JSON.stringify({ name, request })
  });
  return response.data;
};

export const deleteStrategy = async (id: string): Promise<void> => {
  await requestJson<void>(`/api/strategies/${id}`, {
    method: 'DELETE'
  });
};
