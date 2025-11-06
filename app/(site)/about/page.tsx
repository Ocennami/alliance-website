"use client";

import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            About Alliance Organization
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            From Alliance Organization - Your safe space for authentic stories
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="max-w-4xl mx-auto space-y-12"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Mission Section */}
          <motion.section
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50"
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold text-purple-700 mb-4">
              🎯 Our Mission
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Alliance Organization &quot;:v&quot; là một cộng đồng được tạo ra
              để kết nối các thành viên, chia sẻ kiến thức, và xây dựng một môi
              trường học tập và làm việc tích cực. Chúng tôi tin rằng sự hợp tác
              và chia sẻ là chìa khóa để phát triển.
            </p>
          </motion.section>

          {/* Vision Section */}
          <motion.section
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50"
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold text-pink-600 mb-4">
              🔮 Our Vision
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Chúng tôi hướng tới việc xây dựng một nền tảng nơi mọi người có
              thể tự do chia sẻ suy nghĩ, cảm xúc và trải nghiệm của mình trong
              một không gian an toàn và tôn trọng lẫn nhau. Mỗi câu chuyện đều
              có giá trị và đáng được lắng nghe.
            </p>
          </motion.section>

          {/* Values Section */}
          <motion.section
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50"
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold text-purple-700 mb-6">
              💎 Our Values
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-xl font-bold text-purple-600 mb-2">
                  🤝 Community
                </h3>
                <p className="text-gray-600">
                  Xây dựng một cộng đồng gắn kết, nơi mọi người đều được chào
                  đón
                </p>
              </motion.div>
              <motion.div
                className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-xl font-bold text-pink-600 mb-2">
                  🔒 Safety
                </h3>
                <p className="text-gray-600">
                  Đảm bảo môi trường an toàn cho mọi người chia sẻ
                </p>
              </motion.div>
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="text-xl font-bold text-blue-600 mb-2">
                  ✨ Authenticity
                </h3>
                <p className="text-gray-600">
                  Khuyến khích sự chân thành trong mỗi câu chuyện
                </p>
              </motion.div>
              <motion.div
                className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h3 className="text-xl font-bold text-indigo-600 mb-2">
                  🌱 Growth
                </h3>
                <p className="text-gray-600">
                  Cùng nhau học hỏi và phát triển mỗi ngày
                </p>
              </motion.div>
            </div>
          </motion.section>

          {/* Team Section */}
          <motion.section
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50"
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold text-purple-700 mb-4">
              👥 Our Team
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Alliance Organization được điều hành bởi một nhóm các thành viên
              tận tâm, luôn sẵn sàng lắng nghe và hỗ trợ cộng đồng.
            </p>
            <p className="text-gray-600 italic">
              Chúng tôi không chỉ là một tổ chức, chúng tôi là một gia đình
              &quot;:v&quot;
            </p>
          </motion.section>

          {/* Contact CTA */}
          <motion.section
            className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50 text-center"
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold text-purple-700 mb-4">
              📬 Get In Touch
            </h2>
            <p className="text-gray-700 text-lg mb-6">
              Bạn có câu hỏi hoặc muốn tham gia cộng đồng của chúng tôi?
            </p>
            <motion.a
              href="/contact"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-3 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us
            </motion.a>
          </motion.section>
        </motion.div>
      </div>
    </main>
  );
}
