import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth/server";
import { getSessionUser } from "@/lib/auth/session";
import { z } from "zod";

const schema = z.object({ code: z.string().regex(/^\d{6}$/) });

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ message: "bad" }, { status: 400 });

  try {
    const auth = getAuth();
    await auth.api.verifyTOTP({
      body: { code: parsed.data.code },
      headers: req.headers,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "코드가 올바르지 않습니다" }, { status: 400 });
  }
}
