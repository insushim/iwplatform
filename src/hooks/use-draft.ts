"use client";
import { useEffect, useRef, useState } from "react";

/**
 * localStorage 기반 초안 자동저장. 30초 주기로 저장.
 */
export function useDraft<T>(key: string, data: T, intervalMs = 30_000) {
  const [saved, setSaved] = useState<Date | null>(null);
  const ref = useRef(data);
  ref.current = data;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const iv = setInterval(() => {
      try {
        localStorage.setItem(key, JSON.stringify({ data: ref.current, at: Date.now() }));
        setSaved(new Date());
      } catch {
        // storage full
      }
    }, intervalMs);
    const beforeUnload = () => {
      try {
        localStorage.setItem(
          key,
          JSON.stringify({ data: ref.current, at: Date.now() }),
        );
      } catch {
        // noop
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => {
      clearInterval(iv);
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, [key, intervalMs]);

  function load(): { data: T; at: number } | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function clear() {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch {
      // noop
    }
  }

  return { saved, load, clear };
}
