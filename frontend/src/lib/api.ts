const configuredApiBase = (import.meta.env.VITE_API_URL || "https://fin-track-m1qc.onrender.com").replace(/\/+$/, "");
const API_BASE = configuredApiBase.endsWith("/api") ? configuredApiBase : `${configuredApiBase}/api`;

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: string } | null;
    throw new Error(body?.error || `API request failed (${response.status})`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export type ApiHealth = { status: string; database: "connected" | "disconnected" };
export const getApiHealth = () => apiRequest<ApiHealth>("/health");
