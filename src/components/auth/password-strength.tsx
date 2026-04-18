"use client";
import { useMemo } from "react";
import zxcvbn from "zxcvbn";

const LABELS = ["매우 약함", "약함", "보통", "강함", "매우 강함"];
const COLORS = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-lime-500",
  "bg-green-500",
];

export function PasswordStrength({ value }: { value: string }) {
  const { score, feedback } = useMemo(() => {
    if (!value) return { score: 0, feedback: "" };
    const r = zxcvbn(value);
    return {
      score: r.score,
      feedback:
        r.feedback.warning ||
        (r.score >= 3 ? "견고한 비밀번호입니다" : "조합을 다양하게 하면 더 안전해요"),
    };
  }, [value]);

  return (
    <div className="mt-1.5">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              value && i <= score ? COLORS[score] : "bg-muted"
            }`}
          />
        ))}
      </div>
      {value ? (
        <p className="mt-1.5 text-xs text-muted-foreground">
          <span className="font-medium">{LABELS[score]}</span>
          {feedback ? <span> · {feedback}</span> : null}
        </p>
      ) : null}
    </div>
  );
}
