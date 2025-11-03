"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import AvatarCropModal from "./AvatarCropModal";

interface MigrateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MigrateAccountModal({
  isOpen,
  onClose,
}: MigrateAccountModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");

  // Handle avatar change - open crop modal
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: "error", text: "File too large! Maximum 5MB" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result as string);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle cropped image
  const handleCropComplete = (croppedBlob: Blob) => {
    const croppedFile = new File([croppedBlob], "avatar.png", {
      type: "image/png",
    });
    setAvatarFile(croppedFile);
    const previewUrl = URL.createObjectURL(croppedBlob);
    setAvatarPreview(previewUrl);
    setIsCropModalOpen(false);
  };

  const handleMigrateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (!email || !password || !confirmPassword) {
      setMessage({ type: "error", text: "Please fill in all fields!" });
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters!",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: { data: { name: displayName || email.split("@")[0] } },
      });

      if (error) throw error;

      if (data.user) {
        let avatarUrl = null;

        // Upload avatar if provided
        if (avatarFile) {
          try {
            const fileExt = avatarFile.name.split(".").pop();
            const fileName = `${data.user.id}-${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
              .from("avatars")
              .upload(fileName, avatarFile);

            if (uploadError) {
              console.warn("Avatar upload warning:", uploadError);
            } else {
              const { data: urlData } = supabase.storage
                .from("avatars")
                .getPublicUrl(fileName);
              avatarUrl = urlData.publicUrl;
            }
          } catch (avatarErr) {
            console.warn("Avatar upload error:", avatarErr);
          }
        }

        // Try to create profile, but don't fail if table doesn't exist or profile already exists
        try {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert([
              {
                id: data.user.id,
                name: displayName || email.split("@")[0],
                email: email,
                avatar_url: avatarUrl,
              },
            ]);

          // Only log error if it's not a duplicate key error
          if (profileError && !profileError.message.includes("duplicate")) {
            console.warn("Profile creation warning:", profileError);
          }
        } catch (profileErr) {
          // Silently handle profile creation errors
          console.warn("Profile table may not exist:", profileErr);
        }

        setMessage({
          type: "success",
          text: "Account migrated successfully! Please check your email to verify.",
        });

        setTimeout(() => {
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setDisplayName("");
          setAvatarFile(null);
          setAvatarPreview(null);
          onClose();
        }, 2000);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to migrate account!";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
                <div className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 px-8 py-6">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10"
                  >
                    <Dialog.Title className="flex items-center gap-3 text-2xl font-bold text-white">
                      <span className="text-3xl"></span>
                      Migrate New Account
                    </Dialog.Title>
                  </motion.div>
                  <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-20 rounded-full bg-white/20 p-2 text-white transition-all hover:bg-white/30 hover:rotate-90"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
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
                <div className="px-8 py-6">
                  <form onSubmit={handleMigrateAccount} className="space-y-5">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center">
                      <div className="relative mb-3">
                        {avatarPreview ? (
                          <Image
                            src={avatarPreview}
                            alt="Avatar preview"
                            width={100}
                            height={100}
                            className="h-24 w-24 rounded-full object-cover ring-4 ring-purple-200"
                          />
                        ) : (
                          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400 ring-4 ring-purple-200">
                            <span className="text-4xl font-bold text-white">
                              {displayName
                                ? displayName[0].toUpperCase()
                                : email
                                ? email[0].toUpperCase()
                                : "?"}
                            </span>
                          </div>
                        )}
                      </div>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                        <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg">
                          <span>🖼️</span>
                          Add Avatar Profile
                        </div>
                      </label>
                      <p className="mt-2 text-xs text-gray-500">
                        PNG, JPG (maximum 5MB)
                      </p>
                    </div>

                    {/* Display Name */}
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <span className="text-lg"></span>Display Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Enter display name"
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-800 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                      />
                    </div>
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <span className="text-lg"></span>Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email address"
                        required
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-800 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                      />
                    </div>
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <span className="text-lg"></span>Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter password (min 8 characters)"
                          required
                          minLength={8}
                          className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 pr-12 text-gray-800 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? "👁️" : "👁️‍🗨️"}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <span className="text-lg"></span>Confirm Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        required
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-800 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Password must be at least 8 characters
                      </p>
                    </div>
                    {message && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-xl p-3 text-sm ${
                          message.type === "success"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {message.text}
                      </motion.div>
                    )}
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="h-5 w-5 animate-spin"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Migrating...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          {" "}
                          Migrate Account
                        </span>
                      )}
                    </motion.button>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>

      {/* Avatar Crop Modal */}
      <AvatarCropModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        imageSrc={imageToCrop}
        onCropComplete={handleCropComplete}
      />
    </Transition>
  );
}
