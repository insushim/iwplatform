"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function EventForm() {
  const router = useRouter();
  const [pending, start] = useTransition();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: String(fd.get("title") ?? "").trim(),
      description: String(fd.get("description") ?? "").trim(),
      eventType: String(fd.get("eventType") ?? "webinar"),
      locationType: String(fd.get("locationType") ?? "online"),
      locationDetails: String(fd.get("locationDetails") ?? "") || undefined,
      meetingUrl: String(fd.get("meetingUrl") ?? "") || undefined,
      startAt: new Date(String(fd.get("startAt"))).toISOString(),
      endAt: new Date(String(fd.get("endAt"))).toISOString(),
      maxAttendees: fd.get("maxAttendees") ? Number(fd.get("maxAttendees")) : undefined,
      priceKrw: fd.get("priceKrw") ? Number(fd.get("priceKrw")) : 0,
    };
    start(async () => {
      const r = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) {
        toast.error("생성 실패");
        return;
      }
      const { id } = (await r.json()) as { id: string };
      toast.success("이벤트가 만들어졌어요");
      router.push(`/events/${id}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-xl border bg-card p-6">
      <div className="space-y-1.5">
        <Label htmlFor="title">제목</Label>
        <Input id="title" name="title" required maxLength={200} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">설명</Label>
        <Textarea
          id="description"
          name="description"
          required
          className="min-h-[160px]"
          placeholder="무엇에 대한 이벤트인가요? 누가 오면 좋을까요?"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>유형</Label>
          <Select name="eventType" defaultValue="webinar">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="webinar">웨비나</SelectItem>
              <SelectItem value="workshop">워크숍</SelectItem>
              <SelectItem value="meetup">모임</SelectItem>
              <SelectItem value="ama">AMA</SelectItem>
              <SelectItem value="other">기타</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>형태</Label>
          <Select name="locationType" defaultValue="online">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="online">온라인</SelectItem>
              <SelectItem value="offline">오프라인</SelectItem>
              <SelectItem value="hybrid">하이브리드</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="startAt">시작</Label>
          <Input id="startAt" name="startAt" type="datetime-local" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="endAt">종료</Label>
          <Input id="endAt" name="endAt" type="datetime-local" required />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="locationDetails">장소 / Zoom 링크</Label>
        <Input id="locationDetails" name="locationDetails" placeholder="온라인이면 비워두세요" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="meetingUrl">미팅 URL (온라인·하이브리드)</Label>
        <Input id="meetingUrl" name="meetingUrl" type="url" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="maxAttendees">정원 (선택)</Label>
          <Input id="maxAttendees" name="maxAttendees" type="number" min={1} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="priceKrw">참가비 (원, 0 = 무료)</Label>
          <Input id="priceKrw" name="priceKrw" type="number" min={0} defaultValue={0} />
        </div>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : "이벤트 등록"}
      </Button>
    </form>
  );
}
