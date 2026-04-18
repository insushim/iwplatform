"use client";
import { useEffect } from "react";

export function ViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    const key = `viewed:${postId}:${new Date().toISOString().slice(0, 10)}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fetch(`/api/posts/${postId}/view`, { method: "POST", keepalive: true }).catch(
      () => undefined,
    );
  }, [postId]);
  return null;
}
