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
    <div className="fixed bottom-8 left-8 z-50">
      <button
        onClick={handleClick}
        className="w-full overflow-hidden rounded-xl border border-white/20 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-blue-500/20 p-4 shadow-2xl backdrop-blur-md transition-all duration-300 hover:shadow-cyan-400/50"
      >
        <div className="flex items-center gap-x-4">
          <div className="shrink-0">
            <Image
              className="size-12"
              src="/logo/chat.png"
              alt="ChitChat Logo"
              width={32}
              height={32}
            />
          </div>
          <div>
            <div className="text-xl font-medium text-white">
              Alliance Application
            </div>
            <p className="text-gray-200">
              Click to open website download MessageApp
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}
