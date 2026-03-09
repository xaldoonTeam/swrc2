/**
 * SWRC API client for public and admin endpoints.
 * Auth uses cookies (swrc_token) - ensure credentials: 'include' for same-origin or CORS.
 */

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export async function api<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const { token, ...init } = options;
  const headers = new Headers(init.headers as HeadersInit);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

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
  _token?: string | null
): Promise<T> {
  const headers = new Headers();

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body,
    credentials: "include",
  });

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

export async function login(email: string, password: string): Promise<{ user: AuthUser }> {
  return api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    token: null,
  });
}

export async function logout(): Promise<void> {
  await api("/api/auth/logout", { method: "POST", token: null });
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
  imageUrl?: string | null;
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
