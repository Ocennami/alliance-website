"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCode, FiEye, FiSave, FiLayout } from "react-icons/fi";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css";
import "../app/code-editor-theme.css";

interface ProfileCodeEditorProps {
  isOpen: boolean;
  onClose: () => void;
  initialHtml?: string;
  initialCss?: string;
  initialJs?: string;
  onSave: (html: string, css: string, js: string) => void;
}

export default function ProfileCodeEditor({
  isOpen,
  onClose,
  initialHtml = "",
  initialCss = "",
  initialJs = "",
  onSave,
}: ProfileCodeEditorProps) {
  const [html, setHtml] = useState(initialHtml);
  const [css, setCss] = useState(initialCss);
  const [js, setJs] = useState(initialJs);
  const [layout, setLayout] = useState<"horizontal" | "vertical">("horizontal");
  const [previewKey, setPreviewKey] = useState(0);

  // Auto-refresh preview when code changes
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      setPreviewKey((prev) => prev + 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [html, css, js, isOpen]);

  // ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleSave = () => {
    onSave(html, css, js);
    onClose();
  };

  const refreshPreview = () => {
    setPreviewKey((prev) => prev + 1);
  };

  const toggleLayout = () => {
    setLayout((prev) => (prev === "horizontal" ? "vertical" : "horizontal"));
  };

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
      padding: 20px;
      background: #f5f5f5;
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
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="w-full h-full bg-[#1e1e1e] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {/* Header - CodePen Style */}
              <div className="bg-[#131417] border-b border-gray-800 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FiCode className="w-6 h-6 text-blue-400" />
                  <div className="flex flex-col">
                    <h2 className="text-white font-semibold text-base">
                      Custom Profile Code Editor
                    </h2>
                    <p className="text-gray-500 text-xs">
                      Design your unique profile with HTML, CSS & JavaScript
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleLayout}
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-all text-white text-sm flex items-center gap-2 group"
                    title="Toggle Layout"
                  >
                    <FiLayout className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                  </button>
                  <button
                    onClick={refreshPreview}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-all text-white text-sm font-medium flex items-center gap-2 shadow-lg shadow-blue-600/20"
                    title="Refresh Preview"
                  >
                    <FiEye className="w-4 h-4" />
                    Refresh
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-all text-white text-sm font-medium flex items-center gap-2 shadow-lg shadow-green-600/20"
                  >
                    <FiSave className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white p-2 hover:bg-white/5 rounded-md transition-all"
                    title="Close (ESC)"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* CodePen-style Split View */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Editors Container */}
                <div
                  className={`flex ${
                    layout === "horizontal" ? "flex-row" : "flex-col"
                  } flex-1 overflow-hidden`}
                >
                  {/* HTML Editor */}
                  <div className="flex-1 flex flex-col bg-[#1e1e1e] border-r border-gray-800 min-w-0">
                    <div className="bg-[#252526] border-b border-gray-800 px-4 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-orange-400 text-xs">●</span>
                        <span className="text-gray-300 text-sm font-semibold">
                          HTML
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-600 uppercase tracking-wider">
                        Markup
                      </span>
                    </div>
                    <div className="flex-1 overflow-auto">
                      <Editor
                        value={html}
                        onValueChange={setHtml}
                        highlight={(code) =>
                          Prism.highlight(
                            code,
                            Prism.languages.markup,
                            "markup"
                          )
                        }
                        padding={16}
                        className="font-mono text-sm"
                        textareaClassName="focus:outline-none"
                        style={{
                          fontFamily:
                            "'Fira Code', 'Consolas', 'Monaco', monospace",
                          fontSize: 14,
                          backgroundColor: "#1e1e1e",
                          color: "#d4d4d4",
                          minHeight: "100%",
                          lineHeight: "1.5rem",
                        }}
                        placeholder="<!-- Enter your HTML code here -->"
                      />
                    </div>
                  </div>

                  {/* CSS Editor */}
                  <div className="flex-1 flex flex-col bg-[#1e1e1e] border-r border-gray-800 min-w-0">
                    <div className="bg-[#252526] border-b border-gray-800 px-4 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400 text-xs">●</span>
                        <span className="text-gray-300 text-sm font-semibold">
                          CSS
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-600 uppercase tracking-wider">
                        Styles
                      </span>
                    </div>
                    <div className="flex-1 overflow-auto">
                      <Editor
                        value={css}
                        onValueChange={setCss}
                        highlight={(code) =>
                          Prism.highlight(code, Prism.languages.css, "css")
                        }
                        padding={16}
                        className="font-mono text-sm"
                        textareaClassName="focus:outline-none"
                        style={{
                          fontFamily:
                            "'Fira Code', 'Consolas', 'Monaco', monospace",
                          fontSize: 14,
                          backgroundColor: "#1e1e1e",
                          color: "#d4d4d4",
                          minHeight: "100%",
                          lineHeight: "1.5rem",
                        }}
                        placeholder="/* Enter your CSS code here */"
                      />
                    </div>
                  </div>

                  {/* JavaScript Editor */}
                  <div className="flex-1 flex flex-col bg-[#1e1e1e] border-r border-gray-800 min-w-0">
                    <div className="bg-[#252526] border-b border-gray-800 px-4 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400 text-xs">●</span>
                        <span className="text-gray-300 text-sm font-semibold">
                          JS
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-600 uppercase tracking-wider">
                        Scripts
                      </span>
                    </div>
                    <div className="flex-1 overflow-auto">
                      <Editor
                        value={js}
                        onValueChange={setJs}
                        highlight={(code) =>
                          Prism.highlight(
                            code,
                            Prism.languages.javascript,
                            "javascript"
                          )
                        }
                        padding={16}
                        className="font-mono text-sm"
                        textareaClassName="focus:outline-none"
                        style={{
                          fontFamily:
                            "'Fira Code', 'Consolas', 'Monaco', monospace",
                          fontSize: 14,
                          backgroundColor: "#1e1e1e",
                          color: "#d4d4d4",
                          minHeight: "100%",
                          lineHeight: "1.5rem",
                        }}
                        placeholder="// Enter your JavaScript code here"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview Panel */}
                <div className="flex-1 flex flex-col bg-white border-t-4 border-gray-800 min-h-0">
                  <div className="bg-[#252526] px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-gray-300 text-sm font-semibold">
                        Live Preview
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-600 uppercase tracking-wider">
                      Auto-refresh in 1s
                    </span>
                  </div>
                  <div className="flex-1 overflow-hidden bg-white relative">
                    <iframe
                      key={previewKey}
                      srcDoc={getPreviewContent()}
                      className="w-full h-full border-0"
                      title="Live Preview"
                      sandbox="allow-scripts"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Tip - CodePen style */}
              <div className="bg-[#131417] border-t border-gray-800 px-6 py-3 text-xs text-gray-500 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-base">💡</span>
                  <span>
                    Your custom code will be displayed in your profile. Create
                    something unique!
                  </span>
                </div>
                <span className="text-gray-600">
                  Press{" "}
                  <kbd className="px-2 py-0.5 bg-gray-800 rounded text-gray-400 font-mono">
                    ESC
                  </kbd>{" "}
                  to close
                </span>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
