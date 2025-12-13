"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import SettingsModal from "@/components/SettingsModal";

export default function Header() {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      <header className="fixed top-0 z-50 mt-4 sm:mt-8 w-full px-3 sm:px-4">
        <div className="mx-auto max-w-7xl rounded-2xl sm:rounded-full bg-gradient-to-r from-pink-400/30 to-purple-500/30 backdrop-blur-md px-4 sm:px-6 py-3 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-x-2 sm:gap-x-4 min-w-0 flex-1 sm:flex-initial">
              <Image
                src="/logo/OIP.jpg"
                alt="Alliance Organization Logo"
                width={40}
                height={40}
                className="rounded-full flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10"
              />
              <Link
                href="/"
                className="text-sm sm:text-xl font-bold text-white truncate"
              >
                {'Alliance Organization ":v"'}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center gap-x-6 xl:gap-x-8"
              aria-label="Main navigation"
            >
              <Link
                href="/about"
                className="text-sm font-medium text-white transition hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-md px-2 py-1"
              >
                About Us
              </Link>
              <Link
                href="/members"
                className="text-sm font-medium text-white transition hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-md px-2 py-1"
              >
                Members
              </Link>
              <Link
                href="/gallery"
                className="text-sm font-medium text-white transition hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-md px-2 py-1"
              >
                Gallery
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-white transition hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-md px-2 py-1"
              >
                Contact
              </Link>
              <Link
                href="/temple"
                className="text-sm font-medium text-white transition hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-md px-2 py-1"
              >
                Temple
              </Link>
            </nav>

            {/* Right side - Auth and Mobile Menu */}
            <div className="flex items-center gap-x-2 sm:gap-x-4">
              {status === "loading" && (
                <div className="h-8 sm:h-9 w-20 sm:w-24 animate-pulse rounded-full bg-white/20"></div>
              )}

              {status === "unauthenticated" && (
                <Link
                  href="/loginpage"
                  prefetch
                  className="rounded-full bg-white/20 px-3 sm:px-5 py-1.5 sm:py-2 text-sm text-white transition hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="Sign in to your account"
                >
                  Sign In
                </Link>
              )}

              {status === "authenticated" && session.user && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-x-2 rounded-full p-1 transition focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label="User menu"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                  >
                    {session.user.image && (
                      <motion.div
                        key={session.user.image}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Image
                          src={session.user.image}
                          alt={session.user.name || "User Avatar"}
                          width={40}
                          height={40}
                          className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
                        />
                      </motion.div>
                    )}
                    <motion.span
                      key={session.user.name || ""}
                      className="hidden sm:block text-white text-sm"
                      initial={{ opacity: 0, y: -2 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {session.user.name}
                    </motion.span>
                  </button>

                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="ring-opacity-5 absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black focus:outline-none"
                    >
                      <button
                        onClick={() => {
                          setIsModalOpen(true);
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Settings
                      </button>
                      <button
                        onClick={() => signOut()}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.nav
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden overflow-hidden border-t border-white/10 mt-3"
              >
                <div className="py-3 space-y-2">
                  <Link
                    href="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-lg transition"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/members"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-lg transition"
                  >
                    Members
                  </Link>
                  <Link
                    href="/gallery"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-lg transition"
                  >
                    Gallery
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-lg transition"
                  >
                    Contact
                  </Link>
                  <Link
                    href="/temple"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-lg transition"
                  >
                    Temple
                  </Link>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>

      <SettingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
