import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = 32,
  showWordmark = true,
}: {
  className?: string;
  size?: number;
  showWordmark?: boolean;
}) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <svg
        aria-hidden
        viewBox="0 0 40 40"
        width={size}
        height={size}
        className="shrink-0"
      >
        <defs>
          <linearGradient id="edu-logo-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#edu-logo-grad)" />
        <path
          d="M14 14 L11 20 L14 26"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M26 14 L29 20 L26 26"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M22 12 L18 28"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
      {showWordmark ? (
        <span className="text-[17px] font-bold tracking-tight">
          Edu<span className="text-gradient-brand">Makers</span>
        </span>
      ) : null}
    </div>
  );
}
