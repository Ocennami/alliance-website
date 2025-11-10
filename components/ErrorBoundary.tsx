"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
            <div className="max-w-md w-full mx-4">
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/50">
                <div className="text-center">
                  <div className="text-6xl mb-4">😵</div>
                  <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600 mb-4">
                    Oops! Something went wrong
                  </h1>
                  <p className="text-gray-700 mb-6">
                    Đã có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ admin nếu
                    vấn đề vẫn tiếp diễn.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Reload Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
