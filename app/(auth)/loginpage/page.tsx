"use client";

import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import MigrateAccountModal from "@/components/MigrateAccountModal";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  useEffect(() => {
    const shouldShowModal = searchParams.get("showModal") === "true";
    const isSpecialAccount = session?.user?.email === "username1@gmail.com";

    if (shouldShowModal || isSpecialAccount) {
      setShowCreateAccountModal(true);
      if (isSpecialAccount) {
        signOut({ redirect: false });
      }
    }
  }, [searchParams, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Kiểm tra nếu là tài khoản đặc biệt để tạo account mới
      if (email === "username1@gmail.com" && password === "11111111") {
        setIsLoading(false);
        setShowCreateAccountModal(true);
        return;
      }

      const result = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
      });

      if (result?.ok) {
        router.push("/");
      } else {
        setError("Email or password incorrect!");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-6 sm:py-8">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-950"></div>

        {/* Animated gradient orbs */}
        <div className="absolute -left-40 -top-40 h-80 w-80 animate-pulse rounded-full bg-purple-600/30 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-pink-600/30 blur-3xl animation-delay-2000"></div>
        <div className="absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-indigo-600/20 blur-3xl animation-delay-1000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white/20"
            initial={{
              x:
                Math.random() *
                (typeof window !== "undefined" ? window.innerWidth : 1920),
              y:
                Math.random() *
                (typeof window !== "undefined" ? window.innerHeight : 1080),
            }}
            animate={{
              y: [
                null,
                Math.random() *
                  (typeof window !== "undefined" ? window.innerHeight : 1080),
              ],
              x: [
                null,
                Math.random() *
                  (typeof window !== "undefined" ? window.innerWidth : 1920),
              ],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Main login card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Glow effect behind card */}
        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 blur-2xl"></div>

        <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 shadow-2xl backdrop-blur-2xl sm:p-10">
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>

          {/* Logo section */}
          <motion.div
            className="mb-8 flex justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 opacity-75 blur-xl"></div>
              <div className="relative h-24 w-24 rounded-full border-4 border-white/30 bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-1">
                <Image
                  src="/logo/OIP.jpg"
                  alt="Alliance Logo"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Title section */}
          <motion.div
            className="mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="mb-3 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-4xl font-bold text-transparent">
              Welcome back
            </h1>
            <p className="text-base text-gray-300/90">
              Log in{" "}
              <span className="font-semibold text-purple-300">
                Alliance Organization :v
              </span>
            </p>
          </motion.div>

          {/* Error message */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, height: 0 }}
                animate={{ opacity: 1, scale: 1, height: "auto" }}
                exit={{ opacity: 0, scale: 0.9, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6 overflow-hidden"
              >
                <div className="flex items-start gap-3 rounded-xl border border-red-400/30 bg-gradient-to-br from-red-500/20 to-pink-500/20 px-4 py-4 backdrop-blur-sm">
                  <div className="mt-0.5 flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-100">{error}</p>
                  </div>
                  <button
                    onClick={() => setError("")}
                    className="flex-shrink-0 text-red-200 transition-colors hover:text-white"
                  >
                    <svg
                      className="h-5 w-5"
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email input */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-200"
              >
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 blur transition-opacity group-hover:opacity-100"></div>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-gray-400 transition-colors group-hover:text-purple-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10 focus:border-purple-400 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="your.email@example.com"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </motion.div>

            {/* Password input */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-200"
              >
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 blur transition-opacity group-hover:opacity-100"></div>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-gray-400 transition-colors group-hover:text-purple-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-4 pl-12 pr-12 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10 focus:border-purple-400 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="••••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-4 text-gray-400 transition-colors hover:text-purple-400"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Special Account Notice */}
            <AnimatePresence>
              {email === "username1@gmail.com" && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative overflow-hidden rounded-2xl border border-yellow-400/30 bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-orange-500/10 p-4 shadow-lg shadow-yellow-500/20 backdrop-blur-sm"
                >
                  {/* Animated background glow */}
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-yellow-400/5 via-amber-400/10 to-yellow-400/5"></div>

                  {/* Content */}
                  <div className="relative flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 p-2 shadow-lg shadow-yellow-500/50">
                        <svg
                          className="h-5 w-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Text */}
                    <div className="flex-1 space-y-1">
                      <h4 className="flex items-center gap-2 text-sm font-bold text-yellow-300">
                        <span>🌟 Special Admin Account Detected</span>
                      </h4>
                      <p className="text-xs leading-relaxed text-yellow-200/90">
                        This account has{" "}
                        <span className="font-semibold text-yellow-300">
                          special privileges
                        </span>{" "}
                        to create new user accounts.
                        <br />
                        Password:{" "}
                        <code className="rounded bg-yellow-400/20 px-1.5 py-0.5 font-mono text-yellow-300">
                          11111111
                        </code>
                      </p>
                    </div>
                  </div>

                  {/* Decorative corner elements */}
                  <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-yellow-400/10 blur-2xl"></div>
                  <div className="absolute -bottom-4 -left-4 h-12 w-12 rounded-full bg-amber-400/10 blur-xl"></div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative mt-8 w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-size-200 px-6 py-4 font-bold text-white shadow-2xl shadow-purple-500/50 transition-all duration-500 hover:bg-pos-100 hover:shadow-purple-500/60 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>

              {isLoading ? (
                <div className="relative flex items-center justify-center gap-3">
                  <div className="h-5 w-5 animate-spin rounded-full border-3 border-white border-t-transparent"></div>
                  <span className="text-lg">Logging in...</span>
                </div>
              ) : (
                <span className="relative flex items-center justify-center gap-2 text-lg">
                  Log in
                  <svg
                    className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              )}
            </motion.button>
          </form>

          {/* Footer info */}
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="mb-4 flex items-center justify-center gap-2">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/20"></div>
              <svg
                className="h-5 w-5 text-purple-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/20"></div>
            </div>
            <p className="text-sm text-gray-300/80">
              Do not have an account?{" "}
              <span className="font-semibold text-purple-300">
                Contact admin for access
              </span>
            </p>
          </motion.div>
        </div>

        {/* Additional decorative elements */}
        <div className="pointer-events-none absolute -left-8 -top-8 h-40 w-40 rounded-full bg-gradient-to-br from-purple-500/30 to-transparent blur-2xl"></div>
        <div className="pointer-events-none absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-gradient-to-tl from-pink-500/30 to-transparent blur-2xl"></div>
      </motion.div>

      {/* Create Account Modal */}
      <MigrateAccountModal
        isOpen={showCreateAccountModal}
        onClose={() => setShowCreateAccountModal(false)}
      />
    </div>
  );
}
