import { notFound, redirect } from "next/navigation";
import { getDb } from "@/db";
import { posts, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/session";
import { EditPostForm } from "./edit-form";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { user } = await requireAuth();
  const db = getDb();
  const [p] = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  if (!p) notFound();
  if (p.authorId !== user.id) redirect(`/posts/${slug}`);

  const cats = await db
    .select({ id: categories.id, slug: categories.slug, name: categories.name, icon: categories.icon })
    .from(categories);

  return (
    <div className="container-reading py-8">
      <h1 className="text-3xl font-bold tracking-tight">글 수정</h1>
      <div className="mt-6">
        <EditPostForm
          post={{
            id: p.id,
            slug: p.slug,
            title: p.title,
            content: p.content,
            categoryId: p.categoryId,
            isAnonymous: p.isAnonymous,
          }}
          categories={cats}
        />
      </div>
    </div>
  );
}
