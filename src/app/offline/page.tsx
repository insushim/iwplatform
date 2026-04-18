export const metadata = { title: "오프라인" };
export const dynamic = "force-static";

export default function OfflinePage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="text-5xl" aria-hidden>
          📡
        </p>
        <h1 className="mt-4 text-2xl font-bold">인터넷 연결이 없어요</h1>
        <p className="mt-2 text-muted-foreground">
          연결이 복구되면 다시 시도해 주세요. 이미 불러온 페이지는 오프라인에서도 볼 수 있습니다.
        </p>
      </div>
    </div>
  );
}
