"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

interface ProfilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  html: string;
  css: string;
  js: string;
  memberName: string;
}

export default function ProfilePreviewModal({
  isOpen,
  onClose,
  html,
  css,
  js,
  memberName,
}: ProfilePreviewModalProps) {
  const getPreviewContent = () => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      overflow-x: hidden;
    }
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    try {
      ${js}
    } catch (error) {
      console.error('Error in custom JS:', error);
    }
  </script>
</body>
</html>
    `;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Full Screen Modal - No Backdrop */}
          <motion.div
            className="fixed inset-0 bg-white z-50 flex flex-col overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Header - Minimal browser-like bar */}
            <div className="bg-gray-900 text-white px-4 py-2 flex items-center justify-between border-b border-gray-800">
              <div>
                <h2 className="text-xl font-bold">
                  {memberName}&apos;s Custom Profile
                </h2>
                <p className="text-sm text-gray-300 mt-1">
                  Custom designed profile preview
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-sm text-gray-400">
                  {memberName}&apos;s Custom Profile
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                aria-label="Close preview"
              >
                <FiX className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>

            {/* Preview Content - Full Screen Iframe */}
            <div className="flex-1 overflow-hidden bg-white">
              <iframe
                srcDoc={getPreviewContent()}
                className="w-full h-full border-0"
                title="Custom Profile Preview"
                sandbox="allow-scripts"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
