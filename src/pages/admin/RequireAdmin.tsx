import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCookie } from "../../lib/cookies";
import { getMe } from "../../Api/client";

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const userCookie = getCookie("swrc_user");
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    if (!userCookie) {
      setCheckingSession(false);
      setHasSession(false);
      return;
    }

    getMe()
      .then(() => setHasSession(true))
      .catch(() => setHasSession(false))
      .finally(() => setCheckingSession(false));
  }, [userCookie]);

  if (!userCookie) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  if (checkingSession) {
    return null;
  }

  if (!hasSession) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
