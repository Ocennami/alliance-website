"use client";
import { motion } from "framer-motion";
import Link from "next/link";

interface TempleLocation {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  position: { top: string; left: string };
  href: string;
}

export default function TemplePage() {
  const locations: TempleLocation[] = [
    {
      id: "cau-an",
      name: "Cầu An",
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L4 7v2h16V7l-8-5zM6 11v9h12v-9H6zm2 2h8v5H8v-5z" />
        </svg>
      ),
      color: "bg-orange-500",
      borderColor: "border-orange-300",
      position: { top: "45%", left: "18%" },
      href: "/about",
    },
    {
      id: "cau-nguyen",
      name: "Cầu Nguyện",
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L3 9h3v11h12V9h3L12 2zm0 4l5 4v9H7V10l5-4z" />
        </svg>
      ),
      color: "bg-amber-500",
      borderColor: "border-amber-200",
      position: { top: "40%", left: "50%" },
      href: "/cau-nguyen",
    },
    {
      id: "thien-dinh",
      name: "Thiền Định",
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 4l-8 8h3v8h10v-8h3L12 4z" />
        </svg>
      ),
      color: "bg-emerald-500",
      borderColor: "border-emerald-300",
      position: { top: "22%", left: "68%" },
      href: "/members",
    },
    {
      id: "vu-tru",
      name: "Vũ Trụ",
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 15h18v2H3v-2zm0-4h18v2H3v-2zm0-4h18v2H3V7zm0-4h18v2H3V3z" />
        </svg>
      ),
      color: "bg-cyan-500",
      borderColor: "border-cyan-300",
      position: { top: "55%", left: "72%" },
      href: "/contact",
    },
  ];

  return (
    <main className="fixed inset-0 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/kinh-thanh-hue-3-compressed.jpg')",
        }}
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 via-transparent to-amber-900/30" />

      {/* Title */}
      <motion.div
        className="relative z-10 pt-8 pb-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-amber-900 drop-shadow-lg"
          style={{
            fontFamily: "'Playfair Display', serif",
            textShadow: "2px 2px 4px rgba(255,255,255,0.5)",
          }}
        >
          Chùa Linh Thiêng
        </h1>
      </motion.div>

      {/* Interactive Map Container */}
      <div className="relative z-10 w-full h-[calc(100vh-100px)] max-w-6xl mx-auto">
        {locations.map((location, index) => (
          <motion.div
            key={location.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              top: location.position.top,
              left: location.position.left,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: index * 0.15,
              type: "spring",
              stiffness: 200,
            }}
          >
            <Link href={location.href}>
              <motion.div
                className={`
                  relative flex flex-col items-center justify-center
                  w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28
                  rounded-full ${location.color}
                  border-4 ${location.borderColor}
                  cursor-pointer shadow-xl
                  text-white
                `}
                whileHover={{
                  scale: 1.15,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Pulse animation ring */}
                <motion.div
                  className={`absolute inset-0 rounded-full ${location.color} opacity-30`}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Icon */}
                <div className="relative z-10">{location.icon}</div>

                {/* Label */}
                <span className="relative z-10 text-xs md:text-sm font-semibold mt-1 text-center px-1">
                  {location.name}
                </span>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Decorative floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { top: "25%", left: "15%", duration: 3.5, delay: 0.5 },
          { top: "35%", left: "80%", duration: 4, delay: 1 },
          { top: "55%", left: "25%", duration: 3.2, delay: 0.2 },
          { top: "70%", left: "70%", duration: 4.5, delay: 1.5 },
          { top: "40%", left: "60%", duration: 3.8, delay: 0.8 },
          { top: "60%", left: "40%", duration: 4.2, delay: 1.2 },
        ].map((star, i) => (
          <motion.div
            key={i}
            className="absolute w-8 h-8 opacity-20"
            style={{
              top: star.top,
              left: star.left,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
            }}
          >
            <svg viewBox="0 0 24 24" fill="white">
              <path d="M12 2L9 9H2l6 4.5L5.5 22 12 17l6.5 5-2.5-8.5L22 9h-7L12 2z" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Floating clouds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          {
            top: "8%",
            size: "w-24 h-16",
            duration: 60,
            delay: 0,
            opacity: 0.6,
          },
          {
            top: "15%",
            size: "w-32 h-20",
            duration: 80,
            delay: 10,
            opacity: 0.5,
          },
          {
            top: "22%",
            size: "w-20 h-12",
            duration: 50,
            delay: 25,
            opacity: 0.4,
          },
          {
            top: "12%",
            size: "w-28 h-16",
            duration: 70,
            delay: 40,
            opacity: 0.5,
          },
          {
            top: "25%",
            size: "w-16 h-10",
            duration: 45,
            delay: 15,
            opacity: 0.35,
          },
        ].map((cloud, i) => (
          <motion.div
            key={`cloud-${i}`}
            className={`absolute ${cloud.size}`}
            style={{
              top: cloud.top,
            }}
            initial={{ left: "-15%" }}
            animate={{ left: "115%" }}
            transition={{
              duration: cloud.duration,
              repeat: Infinity,
              delay: cloud.delay,
              ease: "linear",
            }}
          >
            <svg
              viewBox="0 0 64 40"
              fill="white"
              className="w-full h-full drop-shadow-sm"
              style={{ opacity: cloud.opacity }}
            >
              <path d="M52 28c6.6 0 12-5.4 12-12s-5.4-12-12-12c-1.2 0-2.4.2-3.5.5C46.5 2 43 0 39 0c-5.5 0-10.2 3.5-12 8.4C25.5 7.5 23.8 7 22 7c-6.1 0-11 4.9-11 11 0 .4 0 .7.1 1.1C5.5 20.3 1 25.4 1 31.5 1 38.4 6.6 44 13.5 44h38c7.5 0 13.5-6 13.5-13.5 0-1-.1-2-.3-2.9-.8.3-1.7.4-2.7.4z" />
            </svg>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
