import { NextResponse, type NextRequest } from "next/server";

// Next middleware는 Edge 런타임이지만 Cloudflare 바인딩을 받지 못하므로
// Better Auth 세션 처리는 각 라우트/서버 컴포넌트에서 수행한다.
// 이 미들웨어는 보안 헤더 강화와 관리자 라우트 1차 차단만 담당한다.

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  // 관리자 페이지 1차 차단 — 실제 role 체크는 각 admin 페이지의 requireRole 에서
  if (pathname.startsWith("/admin")) {
    const hasSession = req.cookies.getAll().some((c) => c.name.startsWith("edumakers"));
    if (!hasSession) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // 추가 보안 헤더 (next.config 에 있는 것 외)
  res.headers.set("X-Permitted-Cross-Domain-Policies", "none");
  res.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  res.headers.set("Cross-Origin-Resource-Policy", "same-site");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest).*)"],
};
