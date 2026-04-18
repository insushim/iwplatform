import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { categories } from "@/db/schema";
import { requireAuth } from "@/lib/auth/session";
import { NewPostForm } from "./new-post-form";

export const metadata: Metadata = { title: "새 글 쓰기" };

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { profile } = await requireAuth().catch(() => {
    redirect("/login?redirect=/posts/new");
  });

  if (profile.teacherStatus !== "verified") {
    redirect("/verify-teacher?reason=post");
  }

  const db = getDb();
  const cats = await db
    .select({ id: categories.id, slug: categories.slug, name: categories.name, icon: categories.icon })
    .from(categories)
    .catch(() => []);
  const { category } = await searchParams;

  return (
    <div className="container-reading py-8">
      <h1 className="text-3xl font-bold tracking-tight">새 글 쓰기</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        교실에서 검증된 경험을 나눠 주세요. 학생 개인정보는 절대 포함하지 마세요.
      </p>
      <div className="mt-6">
        <NewPostForm categories={cats} defaultCategorySlug={category} />
      </div>
    </div>
  );
}
