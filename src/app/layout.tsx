import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.nameKo} · ${SITE.tagline}`,
    template: `%s · ${SITE.nameKo}`,
  },
  description:
    "초·중·고 교사를 위한 AI 커뮤니티. 메이커가 만든 앱을 나누고, 프롬프트를 교환하고, 수업 노하우를 공유하세요.",
  keywords: [
    "교사 커뮤니티",
    "AI 수업",
    "프롬프트",
    "에듀테크",
    "메이커",
    "바이브코딩",
    "교사 앱",
    "인디스쿨",
  ],
  authors: [{ name: "EduMakers" }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE.url,
    siteName: SITE.nameKo,
    title: `${SITE.nameKo} · ${SITE.tagline}`,
    description:
      "선생님이 만든 앱, 프롬프트, 수업 노하우를 한 곳에서 나누는 교사 플랫폼",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.nameKo,
    description: SITE.tagline,
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning className="h-full">
      <body className="flex min-h-full flex-col bg-background text-foreground antialiased">
        <ThemeProvider>
          <QueryProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
            >
              본문으로 건너뛰기
            </a>
            {children}
            <Toaster richColors position="top-right" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
