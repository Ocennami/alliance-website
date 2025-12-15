"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Prayer,
  getPrayers,
  createPrayer,
  subscribeToPrayers,
  unsubscribeFromPrayers,
} from "@/lib/prayers";

export default function CauNguyenPage() {
  const { data: session } = useSession();
  const [incenseCount, setIncenseCount] = useState(3);
  const [showMessage, setShowMessage] = useState(false);
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    prayer: "",
  });

  // Fetch initial prayers and subscribe to real-time updates
  useEffect(() => {
    async function loadPrayers() {
      setIsLoading(true);
      const data = await getPrayers();
      setPrayers(data);
      setIsLoading(false);
    }

    loadPrayers();

    // Subscribe to real-time updates
    const channel = subscribeToPrayers(
      (newPrayer) => {
        setPrayers((prev) => [newPrayer, ...prev]);
      },
      (deletedId) => {
        setPrayers((prev) => prev.filter((p) => p.id !== deletedId));
      }
    );

    return () => {
      unsubscribeFromPrayers(channel);
    };
  }, []);

  const handlePray = () => {
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    const result = await createPrayer({
      author: session?.user?.name || "Ẩn danh",
      user_id: session?.user?.id,
      prayer: formData.prayer,
    });

    if (result) {
      setShowModal(false);
      setFormData({ prayer: "" });
      setIncenseCount((prev) => Math.min(prev + 1, 9));
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }
    setIsSubmitting(false);
  };

  // Split prayers into left (recent) and right (history)
  const leftPrayers = prayers.slice(0, Math.ceil(prayers.length / 2));
  const rightPrayers = prayers.slice(Math.ceil(prayers.length / 2));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const PrayerCard = ({ prayer }: { prayer: Prayer }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-yellow-50 rounded-lg p-3 shadow-md"
    >
      <div className="flex items-center gap-1 text-orange-500 font-semibold mb-1">
        <span>👤</span>
        <span className="text-sm">{prayer.author}</span>
      </div>
      <div className="text-xs text-gray-600 mb-2">
        {formatDate(prayer.timestamp || prayer.created_at)}
      </div>
      {prayer.prayer && (
        <div className="mt-2 pt-2 border-t border-orange-200">
          <div className="text-orange-600 text-xs font-semibold mb-1">
            🧡 Lời khấn:
          </div>
          <div className="text-xs italic text-gray-700">{prayer.prayer}</div>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="h-screen w-full bg-gradient-to-b from-indigo-300 via-purple-400 to-purple-600 flex overflow-hidden">
      {/* Left Panel - Lời Khấn Gần Đây */}
      <div className="w-80 h-screen bg-gradient-to-b from-orange-300 to-orange-400 p-4 overflow-y-auto scrollbar-thin">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/temple" className="text-white text-2xl hover:opacity-80 transition">←</Link>
          <h2 className="text-white text-xl font-bold">Lời Khấn Gần Đây</h2>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="text-white text-center py-4">Đang tải...</div>
          ) : leftPrayers.length === 0 ? (
            <div className="text-white text-center py-4">Chưa có lời khấn</div>
          ) : (
            leftPrayers.map((prayer) => (
              <PrayerCard key={prayer.id} prayer={prayer} />
            ))
          )}
        </div>
      </div>

      {/* Center Panel - Tháp Hương Cầu Nguyện */}
      <div className="flex-1 flex flex-col items-center justify-start pt-8 px-8 relative overflow-hidden">
        <h1 className="text-white text-4xl font-bold mb-8">
          Tháp Hương Cầu Nguyện
        </h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-yellow-50 rounded-3xl p-8 max-w-md w-full shadow-2xl mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className="bg-orange-400 rounded-full p-4">
              <svg
                className="w-12 h-12 text-yellow-200"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2L7 8h6l-3-6z" />
                <path d="M9 9h2v9H9z" />
              </svg>
            </div>
          </div>

          <h2 className="text-orange-500 text-2xl font-bold text-center mb-4">
            Không gian thiền định
          </h2>

          <p className="text-orange-400 italic text-center mb-4">
            Hãy thư giãn và cảm nhận hương thơm của nhang đang cháy.
          </p>

          <p className="text-sm text-gray-600 text-center mb-4">
            {session
              ? 'Nhấn nút "Cầu Nguyện" để gửi lời khấn của bạn'
              : "Đăng nhập để gửi lời khấn của bạn"}
          </p>

          <p className="text-pink-400 text-center font-semibold">
            🌸 Nam mô A Di Đà Phật 🌸
          </p>
        </motion.div>

        {/* Incense Burner */}
        <div className="relative">
          <div className="relative">
            {/* Incense sticks */}
            <div className="flex gap-4 mb-4 justify-center">
              {[...Array(incenseCount)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  <div className="w-2 h-24 bg-amber-800 rounded-t-full relative">
                    <motion.div
                      animate={{
                        opacity: [0.6, 1, 0.6],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                      className="absolute -top-3 left-1/2 -translate-x-1/2"
                    >
                      <div className="text-2xl">🔥</div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Burner bowl */}
            <div className="relative">
              <div className="w-48 h-24 bg-gradient-to-b from-amber-900 to-amber-950 rounded-[50%] border-4 border-orange-400 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-400 to-gray-500 rounded-[50%] m-3">
                  <div className="w-full h-2 bg-white/30 rounded-full mt-2"></div>
                </div>
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-3 bg-amber-950 rounded-b-lg"></div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-32 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            Lời cầu nguyện của bạn đã được gửi đi! 🙏
          </motion.div>
        )}
      </div>

      {/* Right Panel - Lịch Sử Cầu Nguyện */}
      <div className="w-80 h-screen bg-gradient-to-b from-orange-300 to-orange-400 p-4 overflow-y-auto scrollbar-thin">
        <h2 className="text-white text-xl font-bold mb-4">
          Lịch Sử Cầu Nguyện
        </h2>

        <div className="space-y-3">
          {isLoading ? (
            <div className="text-white text-center py-4">Đang tải...</div>
          ) : rightPrayers.length === 0 ? (
            <div className="text-white text-center py-4">Chưa có lịch sử</div>
          ) : (
            rightPrayers.map((prayer) => (
              <PrayerCard key={prayer.id} prayer={prayer} />
            ))
          )}
        </div>
      </div>

      {/* Floating Prayer Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePray}
        className="fixed bottom-8 right-8 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full shadow-2xl flex items-center gap-2 text-lg z-50"
      >
        <span className="text-2xl">🏮</span>
        <span>Cầu Nguyện</span>
      </motion.button>

      {/* Prayer Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-yellow-50 rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-orange-500 text-2xl font-bold text-center mb-4">
                🙏 Gửi Lời Khấn
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Lời khấn *
                  </label>
                  <textarea
                    required
                    value={formData.prayer}
                    onChange={(e) =>
                      setFormData({ ...formData, prayer: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                    placeholder="Nhập lời cầu nguyện của bạn..."
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2 px-4 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition disabled:opacity-50"
                  >
                    {isSubmitting ? "Đang gửi..." : "Gửi Lời Khấn"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
