"use client";

import { useEffect, useState } from "react";

/**
 * Aktuell tid som uppdateras varje sekund. Är null vid serverrenderingen
 * så att nedräkningar bara visas i webbläsaren.
 */
export function useNow(intervalMs = 1000): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}
