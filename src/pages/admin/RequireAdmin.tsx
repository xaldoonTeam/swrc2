import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCookie } from "../../lib/cookies";

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const userCookie = getCookie("swrc_user");

  if (!userCookie) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
