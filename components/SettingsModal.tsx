"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import AvatarCropModal from "./AvatarCropModal";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { data: session, update } = useSession();

  // Form states
  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Crop modal states
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Initialize form
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
    }
  }, [session]);

  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
      setAvatarFile(null);
      setAvatarPreview(null);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage(null);
    }
  }, [isOpen]);

  // Handle avatar change - open crop modal
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: "error", text: "File quá lớn! Tối đa 5MB" });
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
    // Convert blob to file
    const croppedFile = new File([croppedBlob], "avatar.png", {
      type: "image/png",
    });
    setAvatarFile(croppedFile);

    // Create preview
    const previewUrl = URL.createObjectURL(croppedBlob);
    setAvatarPreview(previewUrl);

    // Close crop modal
    setIsCropModalOpen(false);
  };

  // Update profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append("name", name);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      // Call API route
      const response = await fetch("/api/profile/update", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Có lỗi xảy ra!");
      }

      // Update session and force refresh
      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.name,
          image: data.avatarUrl,
        },
      });

      setMessage({ type: "success", text: "Update successful!" });
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred!";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters long!",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: session?.user?.email || "",
        password: currentPassword,
      });

      if (signInError) throw new Error("Current password is incorrect!");

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setMessage({ type: "success", text: "Password changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred!";
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-6">
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="text-2xl font-bold text-white">
                      ⚙️ Account Settings
                    </Dialog.Title>
                    <button
                      onClick={onClose}
                      className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                    >
                      <svg
                        className="h-6 w-6"
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

                <div className="p-6">
                  {/* Message */}
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mb-6 flex items-center justify-between rounded-lg px-4 py-3 ${
                        message.type === "success"
                          ? "bg-green-50 text-green-800 border border-green-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      <span className="text-sm font-medium">
                        {message.text}
                      </span>
                      <button
                        onClick={() => setMessage(null)}
                        className="text-current hover:opacity-70"
                      >
                        <svg
                          className="h-4 w-4"
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
                    </motion.div>
                  )}

                  {/* Profile Section */}
                  <form onSubmit={handleUpdateProfile} className="mb-8">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                      <span>👤</span> Personal Information
                    </h3>

                    <div className="space-y-6 rounded-xl border border-gray-200 bg-gray-50 p-6">
                      {/* Avatar */}
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          {avatarPreview || session?.user?.image ? (
                            <Image
                              src={avatarPreview || session?.user?.image || ""}
                              alt="Avatar"
                              width={80}
                              height={80}
                              className="h-20 w-20 rounded-full object-cover ring-4 ring-purple-200"
                            />
                          ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-3xl font-bold text-white ring-4 ring-purple-200">
                              {session?.user?.name?.charAt(0).toUpperCase() ||
                                "U"}
                            </div>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="avatar"
                            className="inline-block cursor-pointer rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-purple-700 hover:to-pink-700"
                          >
                            📷 Change Profile Picture
                          </label>
                          <input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                          <p className="mt-2 text-xs text-gray-500">
                            PNG, JPG (maximum 5MB)
                          </p>
                        </div>
                      </div>

                      {/* Name */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          placeholder="Enter your name"
                        />
                      </div>

                      {/* Email (read-only) */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          value={session?.user?.email || ""}
                          readOnly
                          className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-500"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Email cannot be changed
                        </p>
                      </div>

                      {/* Submit */}
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-purple-700 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isLoading ? "Saving..." : "💾 Save changes"}
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Password Section */}
                  <form onSubmit={handleChangePassword}>
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                      <span>🔒</span> Change Password
                    </h3>

                    <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-6">
                      {/* Current Password */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          placeholder="Enter current password"
                        />
                      </div>

                      {/* New Password */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          placeholder="Enter new password (minimum 8 characters)"
                        />
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          placeholder="Re-enter new password"
                        />
                      </div>

                      {/* Submit */}
                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          disabled={
                            isLoading ||
                            !currentPassword ||
                            !newPassword ||
                            !confirmPassword
                          }
                          className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-purple-700 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isLoading ? "Processing..." : "🔑 Change password"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>

        {/* Avatar Crop Modal */}
        <AvatarCropModal
          isOpen={isCropModalOpen}
          onClose={() => setIsCropModalOpen(false)}
          imageSrc={imageToCrop}
          onCropComplete={handleCropComplete}
        />
      </Dialog>
    </Transition>
  );
}
