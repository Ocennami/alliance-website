"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { DURATIONS } from "@/lib/constants";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type,
  isVisible,
  onClose,
  duration = DURATIONS.NOTIFICATION_TIMEOUT,
}: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const icons = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
    warning: "⚠️",
  };

  const colors = {
    success: "from-green-500 to-emerald-600",
    error: "from-red-500 to-pink-600",
    info: "from-blue-500 to-cyan-600",
    warning: "from-orange-500 to-amber-600",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-4 right-4 z-[200] max-w-md"
        >
          <div
            className={`bg-gradient-to-r ${colors[type]} text-white rounded-2xl shadow-2xl p-4 border border-white/20 backdrop-blur-lg`}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl flex-shrink-0">{icons[type]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium break-words">{message}</p>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
                aria-label="Close notification"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
