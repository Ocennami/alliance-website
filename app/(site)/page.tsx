"use client";
import ChitChatWidget from "@/components/ChitChatWidget";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra nếu user đăng nhập bằng tài khoản đặc biệt
    if (session?.user?.email === "username1@gmail.com") {
      // Redirect về trang login để hiển thị modal
      router.push("/loginpage?showModal=true");
    }
  }, [session, router]);

  return (
    <main>
      {/* Hero Section với Video Background */}
      <section className="relative h-screen w-full overflow-hidden -mt-28">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover opacity-30 blur-sm"
          >
            <source
              src={process.env.NEXT_PUBLIC_VIDEO_URL || "/video/background.mp4"}
              type="video/mp4"
            />
            {/* Fallback nếu không có video */}
          </video>
          {/* Overlay để làm tối video thêm nếu cần */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex h-full items-center justify-center pt-28">
          <div className="text-center px-4">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl text-white drop-shadow-2xl">
              {'Alliance Organization ":v"'}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl sm:text-2xl text-gray-200 drop-shadow-lg">
              {'Welcome to Group Website Alliance Organization ":v"'}
            </p>
          </div>
        </div>
      </section>

      {/* Nội dung phần dưới */}
      <div className="relative min-h-screen w-full py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-2xl text-gray-300">About...</p>
          </div>
        </div>
      </div>

      <ChitChatWidget />
    </main>
  );
}
