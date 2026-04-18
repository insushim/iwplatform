"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <p className="text-4xl">⚠️</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">문제가 발생했어요</h1>
        <p className="mt-2 text-muted-foreground">
          잠시 후 다시 시도해 주세요. 계속되면 관리자에게 알려주세요.
        </p>
        <div className="mt-8 flex justify-center gap-2">
          <Button onClick={reset}>다시 시도</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            홈으로
          </Button>
        </div>
      </div>
    </div>
  );
}
