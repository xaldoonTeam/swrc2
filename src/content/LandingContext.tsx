import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { LANDING_DEFAULTS, type LandingContent } from "./landing";
import { getLanding } from "./landingApi";

const LandingContext = createContext<LandingContent>(LANDING_DEFAULTS);

export function LandingProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<LandingContent>(LANDING_DEFAULTS);

  useEffect(() => {
    getLanding().then(setContent).catch(() => {});
  }, []);

  return <LandingContext.Provider value={content}>{children}</LandingContext.Provider>;
}

export function useLanding() {
  return useContext(LandingContext);
}
