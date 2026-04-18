"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import { toast } from "sonner";

export function SocialButtons({ redirect = "/feed" }: { redirect?: string }) {
  async function handle(provider: "google" | "kakao") {
    try {
      await authClient.signIn.social({ provider, callbackURL: redirect });
    } catch {
      toast.error("소셜 로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button variant="outline" type="button" onClick={() => handle("google")}>
        <svg aria-hidden viewBox="0 0 24 24" className="size-4">
          <path
            fill="#4285F4"
            d="M21.35 11.1h-9.17v2.98h5.27c-.23 1.23-1.42 3.6-5.27 3.6-3.17 0-5.76-2.63-5.76-5.87S9 5.94 12.18 5.94c1.8 0 3.01.76 3.7 1.42l2.53-2.44C16.82 3.54 14.72 2.6 12.18 2.6 6.97 2.6 2.8 6.78 2.8 11.98s4.17 9.38 9.38 9.38c5.41 0 8.99-3.8 8.99-9.15 0-.61-.07-1.08-.17-1.54z"
          />
        </svg>
        Google
      </Button>
      <Button
        variant="outline"
        type="button"
        onClick={() => handle("kakao")}
        className="bg-[#FEE500] text-[#3C1E1E] hover:bg-[#FDDF32] hover:text-[#3C1E1E]"
      >
        <svg aria-hidden viewBox="0 0 24 24" className="size-4 fill-current">
          <path d="M12 3C6.48 3 2 6.58 2 11c0 2.88 1.87 5.4 4.73 6.82-.2.72-.73 2.67-.84 3.09-.13.5.18.49.38.36.16-.11 2.53-1.71 3.56-2.41.71.1 1.44.16 2.17.16 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
        </svg>
        카카오
      </Button>
    </div>
  );
}
