import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORIES } from "@/lib/constants";
import { Plus } from "lucide-react";

export const metadata: Metadata = { title: "게시판" };

export default function PostsIndexPage() {
  return (
    <div className="container-page py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">게시판</h1>
          <p className="mt-1 text-sm text-muted-foreground">주제별 카테고리를 골라 보세요</p>
        </div>
        <Button asChild>
          <Link href="/posts/new">
            <Plus className="size-4" />
            글쓰기
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {CATEGORIES.map((c) => (
          <Link key={c.slug} href={`/posts/category/${c.slug}`}>
            <Card className="h-full transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
              <CardContent className="flex items-start gap-4 p-5">
                <span className="text-3xl">{c.icon}</span>
                <div className="min-w-0">
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
