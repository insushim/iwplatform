import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/session";
import { EventForm } from "./event-form";

export const metadata: Metadata = { title: "이벤트 만들기" };

export default async function NewEventPage() {
  const { profile } = await requireAuth().catch(() => {
    redirect("/login?redirect=/events/new");
  });
  if (profile.teacherStatus !== "verified") redirect("/verify-teacher");
  return (
    <div className="container-reading py-8">
      <h1 className="text-3xl font-bold tracking-tight">이벤트 만들기</h1>
      <div className="mt-6">
        <EventForm />
      </div>
    </div>
  );
}
