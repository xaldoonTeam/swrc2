import { assetUrl } from "../Api/client";

export const TEAM_CATEGORY = "team";

export function isTeamMember(category: string | null | undefined): boolean {
  return (category ?? "").trim().toLowerCase() === TEAM_CATEGORY;
}

export function teamImage(path: string | null | undefined): string {
  const value = (path ?? "").trim();
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/uploads")) return assetUrl(value);
  return value.startsWith("/") ? value : `/${value}`;
}

export const DEFAULT_TEAM = [
  { name: "Lucky Kassim", role: "Executive Director", image: "/lac.jpg" },
  { name: "Farah Carab", role: "Admin & Finance Manager", image: "/feriha.jpg" },
  { name: "nasteho bashir", role: "Communication Officer", image: "/nasteho.jpg" },
  { name: "Idil Abdirashid Abdirahman", role: "procurement and logistics officer", image: "/idil.jpg" },
  { name: "Samsam Abdi", role: "HR Officer", image: "/samsam.png" },
  { name: "Sagal Adam", role: "Monitoring, Evaluation, Research and Learning (MERL) Officer", image: "/sagal.jpg" },
  { name: "Awale Osman", role: "Finance Officer", image: "/awale.png" },
];
