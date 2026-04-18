import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getSessionUser } from "@/lib/auth/session";
import { ipRateLimit } from "@/lib/security/rate-limit";
import { id as makeId } from "@/lib/utils/slug";


const ALLOWED = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];
const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "UNAUTHENTICATED" }, { status: 401 });

  const rl = await ipRateLimit(req, "upload", 20, 60 * 60);
  if (!rl.ok) return NextResponse.json({ message: "한도 초과" }, { status: 429 });

  const form = await req.formData();
  const file = form.get("file");
  const kind = String(form.get("kind") ?? "media");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "파일이 필요합니다" }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ message: "지원하지 않는 형식" }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ message: "최대 10MB" }, { status: 413 });
  }

  const { env } = getCloudflareContext();
  const bucket = kind === "teacher_doc" ? env.DOCS : env.MEDIA;
  if (!bucket) {
    return NextResponse.json(
      { message: "스토리지가 설정되지 않았습니다" },
      { status: 500 },
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const key = `${kind}/${user.id}/${makeId()}.${ext}`;
  const buf = await file.arrayBuffer();

  await bucket.put(key, buf, {
    httpMetadata: { contentType: file.type },
    customMetadata: { uploadedBy: user.id, kind },
  });

  // hash for document integrity
  const digest = await crypto.subtle.digest("SHA-256", buf);
  const hash = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const publicUrl =
    kind === "teacher_doc"
      ? `/api/files/doc/${key.split("/").pop()}`
      : `/api/files/media/${key.split("/").pop()}`;

  return NextResponse.json({ url: publicUrl, key, hash });
}
