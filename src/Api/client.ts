/**
 * SWRC API client for public and admin endpoints.
 * Auth uses cookies (swrc_token) - ensure credentials: 'include' for same-origin or CORS.
 */

const RAW_API_BASE = import.meta.env.VITE_API_URL ?? "https://api-swrc.up.railway.app/api";
// Allow either ".../api" or host root in env without creating "/api/api/*" URLs.
const API_BASE = RAW_API_BASE.replace(/\/api\/?$/, "");
const AUTH_TOKEN_KEY = "swrc_token";

function readAuthToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string | null | undefined): void {
  try {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch {
    // ignore storage issues
  }
}

export async function api<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const makeRequest = async (): Promise<Response> => {
    const { token, ...init } = options;
    const headers = new Headers(init.headers as HeadersInit);
    headers.set("Content-Type", "application/json");
    const authToken = token ?? readAuthToken();
    if (authToken) {
      headers.set("Authorization", `Bearer ${authToken}`);
    }

    return fetch(`${API_BASE}${path}`, {
      ...init,
      headers,
      credentials: "include",
    });
  };

  const tryRefresh = async (): Promise<boolean> => {
    if (path === "/api/auth/login" || path === "/api/auth/logout" || path === "/api/auth/refresh") {
      return false;
    }
    try {
      const refreshRes = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (!refreshRes.ok) {
        setAuthToken(null);
        return false;
      }
      const data = (await refreshRes.json().catch(() => ({}))) as { token?: string | null };
      if (data?.token) {
        setAuthToken(data.token);
      }
      return true;
    } catch {
      setAuthToken(null);
      return false;
    }
  };

  let res = await makeRequest();
  if (res.status === 401) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      res = await makeRequest();
    }
  }

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error ?? `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/** FormData request (e.g. file upload); do not set Content-Type so browser sets multipart boundary */
export async function apiForm<T>(
  path: string,
  method: string,
  body: FormData,
  token?: string | null
): Promise<T> {
  const makeRequest = async (): Promise<Response> => {
    const headers = new Headers();
    const authToken = token ?? readAuthToken();
    if (authToken) {
      headers.set("Authorization", `Bearer ${authToken}`);
    }
    return fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body,
      credentials: "include",
    });
  };

  let res = await makeRequest();
  if (res.status === 401 && path !== "/api/auth/login" && path !== "/api/auth/logout" && path !== "/api/auth/refresh") {
    try {
      const refreshRes = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (refreshRes.ok) {
        const data = (await refreshRes.json().catch(() => ({}))) as { token?: string | null };
        if (data?.token) setAuthToken(data.token);
        res = await makeRequest();
      } else {
        setAuthToken(null);
      }
    } catch {
      setAuthToken(null);
    }
  }

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error ?? `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// Auth
export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export async function login(
  email: string,
  password: string
): Promise<{ user: AuthUser; token?: string | null }> {
  return api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    token: null,
  });
}

export async function logout(): Promise<void> {
  await api("/api/auth/logout", { method: "POST", token: null });
  setAuthToken(null);
}

export async function getMe(): Promise<AuthUser> {
  return api("/api/auth/me");
  
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export const users = {
  list: () => api<AdminUser[]>("/api/users"),
  create: (data: { email: string; password: string; role: string }) =>
    api<AdminUser>("/api/users", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: { email?: string; password?: string; role?: string }) =>
    api<AdminUser>(`/api/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => api<unknown>(`/api/users/${id}`, { method: "DELETE" }),
};

export async function updateProfile(data: {
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}): Promise<AuthUser> {
  return api("/api/auth/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// Public content types (align with backend)
export interface Publication {
  id: string;
  title: string;
  slug: string;
  type: string;
  description: string;
  year: number;
  pages?: number | null;
  fileSize?: string | null;
  fileUrl?: string | null;
  downloadCount: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Research {
  id: string;
  title: string;
  slug: string;
  authors: string;
  year: number;
  abstract: string;
  methodology?: string | null;
  category: string;
  keywords: string[];
  pdfUrl?: string | null;
  downloadCount: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  iconName?: string | null;
  imageUrls?: string[];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Story {
  id: string;
  name: string;
  role: string;
  category: string;
  story: string;
  quote?: string | null;
  imageUrl?: string | null;
  programsCompleted?: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  title: string;
  type: string;
  description?: string | null;
  duration?: string | null;
  views: number;
  date?: string | null;
  youtubeId?: string | null;
  thumbnailUrl?: string | null;
  mediaType: string;
  fileUrl?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export const publications = {
  list: () => api<Publication[]>("/api/publications"),
  get: (idOrSlug: string) => api<Publication>(`/api/publications/${idOrSlug}`),
};

export const research = {
  list: () => api<Research[]>("/api/research"),
  get: (idOrSlug: string) => api<Research>(`/api/research/${idOrSlug}`),
};

export const programs = {
  list: () => api<Program[]>("/api/programs"),
  get: (idOrSlug: string) => api<Program>(`/api/programs/${idOrSlug}`),
};

export const stories = {
  list: () => api<Story[]>("/api/stories"),
  get: (id: string) => api<Story>(`/api/stories/${id}`),
};

export const media = {
  list: () => api<MediaItem[]>("/api/media"),
  get: (id: string) => api<MediaItem>(`/api/media/${id}`),
};

export interface Newsletter {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  content: string;
  imageUrl?: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export const newsletters = {
  list: () => api<Newsletter[]>("/api/newsletters"),
  get: (idOrSlug: string) => api<Newsletter>(`/api/newsletters/${idOrSlug}`),
};

export interface SiteSettings {
  about_hero?: string;
  about_swrc_text?: string;
  about_vision?: string;
  about_mission?: string;
  footer_mission?: string;
  footer_address?: string;
  footer_phone?: string;
  footer_email?: string;
}

export const settings = {
  get: () => api<SiteSettings>("/api/settings", { token: null }),
  getAdmin: () => api<SiteSettings>("/api/settings/admin"),
  update: (data: SiteSettings) =>
    api<SiteSettings>("/api/settings", { method: "PUT", body: JSON.stringify(data) }),
};

/** Base URL for API (e.g. for PDF/image URLs returned by the API). Empty if using Vite proxy. */
export function getApiBaseUrl(): string {
  return (API_BASE ?? "").replace(/\/$/, "");
}

/** Full URL for an API asset (e.g. /uploads/pdfs/file.pdf). Uses API base when path is relative. */
export function assetUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base = getApiBaseUrl();
  return base ? `${base}${path.startsWith("/") ? path : `/${path}`}` : path;
}

/** Extract YouTube video ID from a full URL or return the value if it's already an 11-char ID. */
export function extractYoutubeVideoId(value: string | null | undefined): string | null {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const fromUrl =
    trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/)?.[1] ??
    trimmed.match(/^([A-Za-z0-9_-]{11})$/)?.[1];
  return fromUrl ?? null;
}
