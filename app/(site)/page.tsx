"use client";
import ChitChatWidget from "@/components/ChitChatWidget";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

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

  const navigationCards = [
    {
      icon: "📖",
      title: "About Us",
      description: "Tìm hiểu về Alliance",
      href: "/about",
      gradient: "from-purple-600 to-blue-600",
      hoverGradient: "from-purple-700 to-blue-700",
    },
    {
      icon: "🎪",
      title: "Our Events",
      description: "Khám phá các sự kiện, câu chuyện và kỷ niệm đáng nhớ",
      href: "/gallery",
      gradient: "from-pink-600 to-rose-600",
      hoverGradient: "from-pink-700 to-rose-700",
    },
    {
      icon: "👥",
      title: "Members",
      description: "Gặp gỡ các thành viên của gia đình Alliance",
      href: "/about#members",
      gradient: "from-cyan-600 to-teal-600",
      hoverGradient: "from-cyan-700 to-teal-700",
    },
    {
      icon: "📧",
      title: "Contact",
      description: "Liên hệ và kết nối với chúng tôi",
      href: "/contact",
      gradient: "from-orange-600 to-amber-600",
      hoverGradient: "from-orange-700 to-amber-700",
    },
  ];

  return (
    <main className="bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 min-h-screen">
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
          </video>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex h-full items-center justify-center pt-28">
          <motion.div
            className="text-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-8xl text-white drop-shadow-2xl mb-6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {'Alliance Organization ":v"'}
            </motion.h1>
            <motion.p
              className="mx-auto max-w-3xl text-xl sm:text-2xl md:text-3xl text-gray-200 drop-shadow-lg font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {'Welcome to Group Website Alliance Organization ":v"'}
            </motion.p>
            <motion.div
              className="mt-8 text-gray-300 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              🎮 Minecraft Community • 5 Years Journey • 10 Members
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="text-white text-3xl opacity-70">↓</div>
        </motion.div>
      </section>

      {/* Navigation Cards Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Khám Phá Alliance
            </h2>
            <p className="text-gray-300 text-lg md:text-xl">
              Chọn một mục để tìm hiểu thêm về chúng tôi
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {navigationCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={card.href}>
                  <motion.div
                    className={`relative group bg-gradient-to-br ${card.gradient} rounded-2xl p-8 shadow-2xl cursor-pointer overflow-hidden h-full`}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Hover Effect Overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${card.hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    ></div>

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                        {card.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {card.title}
                      </h3>
                      <p className="text-white/90 text-base leading-relaxed">
                        {card.description}
                      </p>

                      {/* Arrow Icon */}
                      <div className="mt-6 flex items-center text-white/80 group-hover:text-white transition-colors">
                        <span className="text-sm font-semibold mr-2">
                          Xem thêm
                        </span>
                        <svg
                          className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Call to Action */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-3xl p-12 text-center border border-white/10"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              🚀 Hành Trình Vẫn Tiếp Tục
            </h3>
            <p className="text-gray-200 text-lg md:text-xl mb-8">
              Từ 2020 đến 2025 và còn nhiều hơn thế nữa...
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/about">
                <button className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:scale-105 transform transition shadow-xl hover:shadow-2xl">
                  Tìm Hiểu Ngay
                </button>
              </Link>
              <Link href="/contact">
                <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-full font-bold text-lg hover:scale-105 transform transition border-2 border-white/30 hover:bg-white/20">
                  Liên Hệ Với Chúng Tôi
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <ChitChatWidget />
    </main>
  );
}
