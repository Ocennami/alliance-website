"use client";

import Image from "next/image";

interface ChitChatWidgetProps {
  onClick?: () => void;
}

export default function ChitChatWidget({ onClick }: ChitChatWidgetProps) {
  const handleClick = () => {
    window.open("https://oceanami.app", "_blank", "noopener,noreferrer");

    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:bottom-8 sm:left-8 sm:translate-x-0 z-50 w-[calc(100%-2rem)] sm:w-auto max-w-md">
      <button
        onClick={handleClick}
        className="w-full overflow-hidden rounded-xl border border-white/20 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-blue-500/20 p-3 sm:p-4 shadow-2xl backdrop-blur-md transition-all duration-300 hover:shadow-cyan-400/50"
      >
        <div className="flex items-center gap-x-3 sm:gap-x-4">
          <div className="shrink-0">
            <Image
              className="w-10 h-10 sm:w-12 sm:h-12"
              src="/logo/chat.png"
              alt="ChitChat Logo"
              width={48}
              height={48}
            />
          </div>
          <div className="text-left min-w-0 flex-1">
            <div className="text-base sm:text-xl font-medium text-white">
              Alliance Application
            </div>
            <p className="text-xs sm:text-sm text-gray-200 truncate">
              Click to open website download MessageApp
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}
