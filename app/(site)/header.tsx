"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import SettingsModal from "@/components/SettingsModal";

export default function Header() {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
      <header className="fixed top-0 z-50 mt-8 w-full">
        <div className="mx-auto max-w-7xl rounded-full bg-gradient-to-r from-pink-400/30 to-purple-500/30 backdrop-blur-md px-6 py-3 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-4">
              <Image
                src="/logo/OIP.jpg"
                alt="Alliance Organization Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <Link href="/" className="text-xl font-bold text-white">
                {'Alliance Organization ":v"'}
              </Link>
            </div>

            <nav className="flex items-center gap-x-8"></nav>
            <Link
              href="/about"
              className="text-sm font-medium text-white transition hover:text-gray-200"
            >
              About Us
            </Link>
            <Link
              href="/members"
              className="text-sm font-medium text-white transition hover:text-gray-200"
            >
              Members
            </Link>
            <Link
              href="/server"
              className="text-sm font-medium text-white transition hover:text-gray-200"
            >
              Server
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-white transition hover:text-gray-200"
            >
              Contact
            </Link>

            <div className="flex items-center gap-x-4">
              {status === "loading" && (
                <div className="h-9 w-24 animate-pulse rounded-full bg-white/20"></div>
              )}

              {status === "unauthenticated" && (
                <Link
                  href="/loginpage"
                  prefetch
                  className="rounded-full bg-white/20 px-5 py-2 text-white transition hover:bg-white/30"
                >
                  Sign In
                </Link>
              )}

              {status === "authenticated" && session.user && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-x-2 rounded-full p-1 transition"
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
                          className="rounded-full"
                        />
                      </motion.div>
                    )}
                    <motion.span
                      key={session.user.name || ""}
                      className="hidden text-white sm:block"
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
            </div>
          </div>
        </div>
      </header>

      <SettingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
