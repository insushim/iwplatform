import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-black text-gradient-brand">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">페이지를 찾을 수 없어요</h1>
        <p className="mt-2 text-muted-foreground">
          주소가 바뀌었거나, 삭제되었을 수 있습니다.
        </p>
        <div className="mt-8 flex justify-center gap-2">
          <Button asChild>
            <Link href="/">홈으로</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/feed">피드로</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
