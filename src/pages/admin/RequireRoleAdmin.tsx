import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCookie } from "../../lib/cookies";

export default function RequireRoleAdmin({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  let user: { role?: string } = {};
  try {
    const raw = getCookie("swrc_user");
    user = raw ? JSON.parse(raw) : {};
  } catch {
    // ignore
  }

  if (!getCookie("swrc_user")) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}
