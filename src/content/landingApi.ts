import { api, apiForm, type Newsletter } from "../Api/client";
import { LANDING_DEFAULTS, mergeLanding, type LandingContent } from "./landing";

/** Stored with the existing news API so saves work before the landing route is deployed. */
export const LANDING_PAGE_TITLE = "SWRC landing page";

export function isStoredLandingItem(title: string): boolean {
  return title === LANDING_PAGE_TITLE || title.startsWith("Landing image");
}

function canStoreWithNews(error: unknown): boolean {
  if (!(error instanceof Error)) return true;
  const status = Number(error.message.match(/\b(\d{3})\b/)?.[1]);
  return status !== 400 && status !== 401 && status !== 403;
}

async function readFromNews(): Promise<LandingContent> {
  const list = await api<Newsletter[]>("/api/newsletters", { token: null });
  const record = list.find((item) => item.title === LANDING_PAGE_TITLE);
  if (!record?.content) return LANDING_DEFAULTS;
  try {
    return mergeLanding(JSON.parse(record.content));
  } catch {
    return LANDING_DEFAULTS;
  }
}

async function saveToNews(data: LandingContent): Promise<LandingContent> {
  const list = await api<Newsletter[]>("/api/newsletters/admin/list");
  const existing = list.find((item) => item.title === LANDING_PAGE_TITLE);
  const form = new FormData();
  form.set("title", LANDING_PAGE_TITLE);
  form.set("summary", "Landing page content");
  form.set("content", JSON.stringify(data));
  form.set("published", "true");
  if (existing) {
    await apiForm<Newsletter>(`/api/newsletters/${existing.id}`, "PUT", form);
  } else {
    await apiForm<Newsletter>("/api/newsletters", "POST", form);
  }
  return data;
}

export async function getLanding(): Promise<LandingContent> {
  try {
    const data = await api<LandingContent>("/api/settings/landing", { token: null });
    return mergeLanding(data);
  } catch (error) {
    if (!canStoreWithNews(error)) throw error;
  }
  return readFromNews();
}

export async function saveLanding(data: LandingContent): Promise<LandingContent> {
  try {
    const saved = await api<LandingContent>("/api/settings/landing", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return mergeLanding(saved);
  } catch (error) {
    if (!canStoreWithNews(error)) throw error;
  }
  return saveToNews(data);
}

export async function uploadLandingImage(file: File): Promise<string> {
  const direct = new FormData();
  direct.append("image", file);
  try {
    const result = await apiForm<{ url: string }>("/api/settings/landing/image", "POST", direct);
    return result.url;
  } catch (error) {
    if (!canStoreWithNews(error)) throw error;
  }

  const form = new FormData();
  form.set("title", `Landing image ${Date.now()}`);
  form.set("content", " ");
  form.set("published", "false");
  form.append("image", file);
  const created = await apiForm<Newsletter>("/api/newsletters", "POST", form);
  if (created.id) {
    await api<unknown>(`/api/newsletters/${created.id}`, { method: "DELETE" }).catch(() => {});
  }
  if (!created.imageUrl) throw new Error("Image upload failed");
  return created.imageUrl;
}
