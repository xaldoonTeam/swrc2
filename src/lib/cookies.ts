/** Parse document.cookie into a Record */
function parseCookies(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of document.cookie.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key && rest.length) {
      out[key] = decodeURIComponent(rest.join("=").trim());
    }
  }
  return out;
}

export function getCookie(name: string): string | null {
  return parseCookies()[name] ?? null;
}

export function setCookie(name: string, value: string, maxAgeSeconds = 7 * 24 * 60 * 60) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

export function removeCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`;
}
