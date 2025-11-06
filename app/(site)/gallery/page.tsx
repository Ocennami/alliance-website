"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function GalleryPage() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const events = [
    {
      id: "event1",
      name: "Event 1",
      period: "2020-2021",
      description: "Event đầu tiên trong server riêng của Alliance",
      icon: "🎪",
      color: "from-green-500 to-emerald-600",
      stats: { participants: "10", duration: "2 tuần", rewards: "Rare items" },
    },
    {
      id: "event2",
      name: "Event 2",
      period: "2022-2023",
      description: "Event đặc biệt với nhiều thử thách mới",
      icon: "🎯",
      color: "from-purple-500 to-pink-600",
      stats: { participants: "10", duration: "3 tuần", rewards: "Epic items" },
    },
    {
      id: "event3",
      name: "Event 3",
      period: "2024-2025",
      description: "Event hoành tráng nhất từ trước đến nay",
      icon: "�",
      color: "from-blue-500 to-cyan-600",
      stats: { participants: "10", duration: "1 tháng", rewards: "Legendary" },
    },
  ];

  const highlights = [
    {
      icon: "👥",
      title: "10 Thành Viên",
      description: "Một gia đình nhỏ, gắn kết chặt chẽ",
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: "�",
      title: "3 Events",
      description: "Những thú vui tao nhã",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: "🌏",
      title: "Online Community",
      description: "Chưa bao giờ gặp mặt, nhưng như đã quen từ lâu",
      color: "from-green-500/20 to-emerald-500/20",
    },
    {
      icon: "⏰",
      title: "5 Năm",
      description: "2020-2025: Hành trình đáng nhớ",
      color: "from-orange-500/20 to-red-500/20",
    },
  ];

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mb-4">
            � Our Events & Memories
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Alliance Organization - Kết nối qua màn hình, gắn kết qua Minecraft
          </p>
          <p className="text-lg text-gray-600 mt-2">
            Từ server nổi tiếng aemine.vn đến những event đáng nhớ bên nhau
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {highlights.map((item, index) => (
            <motion.div
              key={index}
              className={`bg-gradient-to-br ${item.color} backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/50`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px -15px rgba(168, 85, 247, 0.4)",
                transition: { duration: 0.2 },
              }}
            >
              <div className="text-5xl mb-3">{item.icon}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Events Timeline */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-12">
            🎪 Events Timeline
          </h2>

          <div className="space-y-8">
            {events.map((game, index) => (
              <motion.div
                key={game.id}
                className={`bg-gradient-to-r ${game.color} rounded-3xl p-8 shadow-2xl border border-white/30 text-white cursor-pointer`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  transition: { duration: 0.2 },
                }}
                onClick={() =>
                  setSelectedGame(selectedGame === game.id ? null : game.id)
                }
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-6xl">{game.icon}</div>
                    <div>
                      <h3 className="text-3xl font-bold mb-1">{game.name}</h3>
                      <p className="text-white/90 text-lg">{game.period}</p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: selectedGame === game.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </motion.div>
                </div>

                <p className="text-xl mb-6 text-white/95">{game.description}</p>

                {/* Expanded Stats */}
                <motion.div
                  initial={false}
                  animate={{
                    height: selectedGame === game.id ? "auto" : 0,
                    opacity: selectedGame === game.id ? 1 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/30">
                    {Object.entries(game.stats).map(([key, value]) => (
                      <div
                        key={key}
                        className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center"
                      >
                        <div className="text-3xl font-bold mb-1">{value}</div>
                        <div className="text-sm uppercase tracking-wide text-white/80">
                          {key}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* The Story */}
        <motion.section
          className="bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/50 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          whileHover={{
            scale: 1.01,
            boxShadow: "0 25px 50px -15px rgba(168, 85, 247, 0.4)",
            transition: { duration: 0.2 },
          }}
        >
          <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-8">
            💫 Our Story
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-xl leading-relaxed mb-6">
              Alliance Organization &quot;:v&quot; được thành lập từ năm{" "}
              <strong>2023</strong>, bắt đầu vào năm <strong>2020</strong> khi
              chúng tôi gặp nhau tại{" "}
              <strong className="text-purple-600">aemine.vn</strong> - một
              server Minecraft lớn và nổi tiếng tại Việt Nam. Chúng tôi cùng đam
              mê, cùng hoà mình vào thế giới block của Minecraft.
            </p>
            <p className="text-xl leading-relaxed mb-6">
              Sau đó, chủ nhóm Oceanami tạo ra <strong>server riêng</strong>{" "}
              cùng với đó thành lập nhóm để anh em có thể kết nối với nhau mà
              không cần qua game. Nhóm hoạt động{" "}
              <strong> 3 events đặc biệt</strong> từ 2022 đến 2025. Ban đầu nhóm
              chưa có mục đích cụ thể nên 2 event trước đó chủ yếu chỉ có vài
              người. Vào 2023 nhóm có tên là{" "}
              <strong>Alliance Organization &quot;:v&quot;</strong> và tập hợp
              đầy đủ những con người năm xưa. Nơi đây đã là một dấu ấn, một kỷ
              niệm không thể nào quên với những thử thách và niềm vui được chia
              sẻ cùng nhau.
            </p>
            <p className="text-xl leading-relaxed mb-6">
              Đặc biệt, chúng tôi{" "}
              <strong>chưa bao giờ gặp mặt nhau ngoài đời thực</strong>. Mọi kết
              nối, mọi kỷ niệm đều được tạo nên qua màn hình máy tính, qua những
              cuộc trò chuyện đêm khuya trong Discord, Message, qua những màn
              phối hợp ăn ý trong từng câu thoại, minigames.
            </p>
            <p className="text-xl leading-relaxed text-center font-semibold text-purple-700">
              &quot;Khoảng cách địa lý không thể ngăn cản tình bạn thật sự&quot;
              🌟
            </p>
          </div>
        </motion.section>

        {/* Fun Facts */}
        <motion.section
          className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 20px 40px -15px rgba(249, 115, 22, 0.4)",
            transition: { duration: 0.2 },
          }}
        >
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-yellow-600 mb-8">
            🎯 Fun Facts
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              className="bg-white/40 backdrop-blur-sm rounded-2xl p-6"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                boxShadow: "0 15px 30px -10px rgba(249, 115, 22, 0.4)",
                transition: { duration: 0.2 },
              }}
            >
              <div className="text-5xl mb-3">💬</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Messenger 24/7
              </h3>
              <p className="text-gray-600">
                Server của chúng tôi luôn luôn giúp đỡ lẫn nhau
              </p>
            </motion.div>

            <motion.div
              className="bg-white/40 backdrop-blur-sm rounded-2xl p-6"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                boxShadow: "0 15px 30px -10px rgba(249, 115, 22, 0.4)",
                transition: { duration: 0.2 },
              }}
            >
              <div className="text-5xl mb-3">🌙</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Happy&Sociable
              </h3>
              <p className="text-gray-600">Vui vẻ hòa đồng mọi lúc mọi nơi</p>
            </motion.div>

            <motion.div
              className="bg-white/40 backdrop-blur-sm rounded-2xl p-6"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                boxShadow: "0 15px 30px -10px rgba(249, 115, 22, 0.4)",
                transition: { duration: 0.2 },
              }}
            >
              <div className="text-5xl mb-3">⛏️</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Minecraft Fans
              </h3>
              <p className="text-gray-600">
                Từ aemine.vn đến server riêng của Alliance
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Future Plans */}
        <motion.section
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.3 }}
        >
          <motion.div
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full px-8 py-4 shadow-xl"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 40px -15px rgba(168, 85, 247, 0.6)",
              transition: { duration: 0.2 },
            }}
          >
            <p className="text-2xl font-bold">
              🚀 Hành trình vẫn tiếp tục... Event 4 sắp tới? Mong mọi người sẽ
              tham gia {"<3"}
            </p>
          </motion.div>
        </motion.section>
      </div>
    </main>
  );
}
