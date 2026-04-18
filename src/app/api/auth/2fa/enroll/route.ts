import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth/server";
import { getSessionUser } from "@/lib/auth/session";
import { z } from "zod";

const schema = z.object({ password: z.string().min(1) });

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ message: "bad" }, { status: 400 });

  try {
    const auth = getAuth();
    const result = await auth.api.enableTwoFactor({
      body: { password: parsed.data.password },
      headers: req.headers,
    });
    return NextResponse.json({
      uri: result.totpURI,
      secret: result.totpURI?.match(/secret=([^&]+)/)?.[1] ?? "",
      backupCodes: result.backupCodes,
    });
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "enroll failed" },
      { status: 400 },
    );
  }
}
