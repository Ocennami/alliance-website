"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import {
  FiEdit2,
  FiX,
  FiSave,
  FiUser,
  FiCalendar,
  FiCode,
  FiEye,
  FiLock,
} from "react-icons/fi";
import ProfileCodeEditor from "@/components/ProfileCodeEditor";
import ProfilePreviewModal from "@/components/ProfilePreviewModal";

interface MemberProfile {
  id: string;
  name: string;
  avatar_url: string | null;
  role: string;
  bio: string;
  joined_at: string;
  achievements: string[];
  favorite_game: string;
  quote: string;
  custom_html?: string;
  custom_css?: string;
  custom_js?: string;
  use_custom_profile?: boolean;
}

export default function MembersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<MemberProfile>>({});
  const [codeEditorOpen, setCodeEditorOpen] = useState(false);
  const [currentEditingProfile, setCurrentEditingProfile] =
    useState<MemberProfile | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewProfile, setPreviewProfile] = useState<MemberProfile | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // Kiểm tra đăng nhập
  useEffect(() => {
    if (status === "loading") return; // Đợi kiểm tra session

    if (status === "unauthenticated") {
      // Chuyển hướng về trang login nếu chưa đăng nhập
      router.push("/loginpage");
    }
  }, [status, router]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("joined_at", { ascending: true });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Fetched members:", data);
      setMembers(data || []);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (member: MemberProfile) => {
    setEditingMemberId(member.id);
    setEditFormData(member);
  };

  const handleCancelEdit = () => {
    setEditingMemberId(null);
    setEditFormData({});
  };

  const handleSaveProfile = async () => {
    if (!session?.user?.id) {
      alert("You must be logged in to edit profile");
      return;
    }

    if (!editFormData.id) {
      alert("Invalid profile data");
      return;
    }

    console.log("Saving profile:", {
      userId: session.user.id,
      profileId: editFormData.id,
      updates: {
        name: editFormData.name,
        bio: editFormData.bio,
        role: editFormData.role,
        quote: editFormData.quote,
        favorite_game: editFormData.favorite_game,
      },
    });

    try {
      // Giữ lại custom code nếu có
      const updateData: Partial<MemberProfile> = {
        name: editFormData.name,
        bio: editFormData.bio,
        role: editFormData.role,
        quote: editFormData.quote,
        favorite_game: editFormData.favorite_game,
        achievements: editFormData.achievements || [],
      };

      // Preserve custom code if it exists
      if (editFormData.custom_html !== undefined) {
        updateData.custom_html = editFormData.custom_html;
      }
      if (editFormData.custom_css !== undefined) {
        updateData.custom_css = editFormData.custom_css;
      }
      if (editFormData.custom_js !== undefined) {
        updateData.custom_js = editFormData.custom_js;
      }
      if (editFormData.use_custom_profile !== undefined) {
        updateData.use_custom_profile = editFormData.use_custom_profile;
      }

      console.log("Update data to send:", updateData);

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", editFormData.id);

      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }

      console.log("Profile updated successfully");

      // Refresh data from server
      await fetchMembers();
      setEditingMemberId(null);
      setEditFormData({});
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(
        `Failed to update profile: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleOpenCodeEditor = (member: MemberProfile) => {
    setCurrentEditingProfile(member);
    setCodeEditorOpen(true);
  };

  const handleSaveCustomCode = async (
    html: string,
    css: string,
    js: string
  ) => {
    if (!currentEditingProfile) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          custom_html: html,
          custom_css: css,
          custom_js: js,
          use_custom_profile: true,
        })
        .eq("id", currentEditingProfile.id);

      if (error) throw error;

      await fetchMembers();
      setCodeEditorOpen(false);
      setCurrentEditingProfile(null);
      alert("Custom profile code saved successfully!");
    } catch (error) {
      console.error("Error saving custom code:", error);
      alert("Failed to save custom code");
    }
  };

  const handleOpenPreview = (member: MemberProfile) => {
    setPreviewProfile(member);
    setPreviewModalOpen(true);
  };

  const canEditMember = (memberId: string) => {
    return session?.user?.id === memberId;
  };

  // Hiển thị loading khi đang kiểm tra session
  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">
            Đang kiểm tra quyền truy cập...
          </p>
        </div>
      </main>
    );
  }

  // Hiển thị thông báo nếu chưa đăng nhập (fallback case)
  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <motion.div
          className="text-center bg-white p-12 rounded-2xl shadow-2xl max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FiLock className="w-20 h-20 text-purple-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Yêu cầu đăng nhập
          </h2>
          <p className="text-gray-600 mb-8">
            Bạn cần đăng nhập để xem danh sách thành viên
          </p>
          <motion.button
            onClick={() => router.push("/loginpage")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Đi đến trang đăng nhập
          </motion.button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Hero Header with Animation */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              type: "spring",
              stiffness: 100,
            }}
          >
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
                Our Members
              </span>
            </h1>
          </motion.div>
          <motion.p
            className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto font-light mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Gặp gỡ {members.length} thành viên của Alliance Organization
          </motion.p>
          <motion.p
            className="text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Mỗi member card là profile cá nhân - Chỉ chủ nhân mới có quyền chỉnh
            sửa
          </motion.p>
        </motion.div>

        {/* Animated Stats Cards with Gradient */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <motion.div
            className="relative bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl overflow-hidden"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            whileHover={{ scale: 1.05, rotate: 1, y: -5 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <motion.p
              className="text-6xl font-bold mb-2 relative z-10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
            >
              {members.length}
            </motion.p>
            <p className="text-purple-100 font-semibold text-lg relative z-10">
              Total Members
            </p>
          </motion.div>

          <motion.div
            className="relative bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-8 text-white shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            whileHover={{ scale: 1.05, rotate: -1, y: -5 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <motion.p
              className="text-6xl font-bold mb-2 relative z-10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.3, type: "spring", stiffness: 200 }}
            >
              2020
            </motion.p>
            <p className="text-pink-100 font-semibold text-lg relative z-10">
              Since
            </p>
          </motion.div>

          <motion.div
            className="relative bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            whileHover={{ scale: 1.05, rotate: 1, y: -5 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <motion.p
              className="text-6xl font-bold mb-2 relative z-10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
            >
              ∞
            </motion.p>
            <p className="text-blue-100 font-semibold text-lg relative z-10">
              Memories
            </p>
          </motion.div>
        </motion.div>

        {/* Members Grid with Enhanced Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {members.map((member, index) => {
            const isEditing = editingMemberId === member.id;
            const isMyProfile = canEditMember(member.id);

            const gradients = [
              "from-purple-400 to-pink-400",
              "from-blue-400 to-cyan-400",
              "from-pink-400 to-rose-400",
              "from-indigo-400 to-purple-400",
              "from-green-400 to-teal-400",
              "from-orange-400 to-amber-400",
            ];
            const gradient = gradients[index % gradients.length];

            return (
              <motion.div
                key={member.id}
                className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-2xl"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                {/* Gradient Header with Avatar */}
                <div
                  className={`relative bg-gradient-to-br ${gradient} p-8 pb-16`}
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full -mr-20 -mt-20 blur-2xl"></div>
                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <motion.div
                      className="flex-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                    >
                      {member.avatar_url ? (
                        <Image
                          src={member.avatar_url}
                          alt={member.name}
                          width={96}
                          height={96}
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-2xl ring-4 ring-white/50"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-white/90 flex items-center justify-center border-4 border-white shadow-2xl ring-4 ring-white/50">
                          <FiUser className="w-12 h-12 text-gray-600" />
                        </div>
                      )}
                    </motion.div>
                    <div className="flex gap-2">
                      {/* Preview button */}
                      {member.use_custom_profile && member.custom_html && (
                        <motion.button
                          onClick={() => handleOpenPreview(member)}
                          className="p-2.5 rounded-xl bg-white/90 backdrop-blur-sm border border-white/50 hover:bg-white transition-all shadow-lg"
                          title="View custom profile"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiEye className="w-5 h-5 text-gray-700" />
                        </motion.button>
                      )}

                      {/* Edit and Code buttons */}
                      {isMyProfile && !isEditing && (
                        <>
                          <motion.button
                            onClick={() => handleEditClick(member)}
                            className="p-2.5 rounded-xl bg-white/90 backdrop-blur-sm border border-white/50 hover:bg-white transition-all shadow-lg"
                            title="Edit your profile"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FiEdit2 className="w-5 h-5 text-gray-700" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleOpenCodeEditor(member)}
                            className="p-2.5 rounded-xl bg-white/90 backdrop-blur-sm border border-white/50 hover:bg-white transition-all shadow-lg"
                            title="Code custom profile"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FiCode className="w-5 h-5 text-gray-700" />
                          </motion.button>
                        </>
                      )}
                    </div>
                  </div>

                  {!isEditing ? (
                    <>
                      <div className="relative z-10">
                        <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                          {member.name}
                        </h3>
                        <p className="text-white/90 font-semibold mb-3 text-lg drop-shadow">
                          {member.role || "Member"}
                        </p>
                        <div className="flex items-center text-white/80 gap-2 text-sm">
                          <FiCalendar className="w-4 h-4" />
                          <span>
                            Joined {new Date(member.joined_at).getFullYear()}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3 relative z-10">
                      <input
                        type="text"
                        value={editFormData.name || ""}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                        placeholder="Name"
                      />
                      <input
                        type="text"
                        value={editFormData.role || ""}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            role: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                        placeholder="Role"
                      />
                    </div>
                  )}
                </div>

                {/* Content Section with Better Design */}
                <div className="p-8 -mt-8 relative bg-white rounded-t-3xl">
                  {isEditing ? (
                    <div className="space-y-4">
                      <textarea
                        value={editFormData.bio || ""}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            bio: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-purple-400 text-sm transition-colors"
                        placeholder="Bio"
                        rows={3}
                      />
                      <input
                        type="text"
                        value={editFormData.favorite_game || ""}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            favorite_game: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-purple-400 text-sm transition-colors"
                        placeholder="Favorite Game"
                      />
                      <textarea
                        value={editFormData.quote || ""}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            quote: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-purple-400 text-sm transition-colors"
                        placeholder="Quote"
                        rows={2}
                      />

                      <div className="flex gap-3 pt-4">
                        <motion.button
                          onClick={handleSaveProfile}
                          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FiSave className="w-5 h-5" />
                          Save
                        </motion.button>
                        <motion.button
                          onClick={handleCancelEdit}
                          className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FiX className="w-5 h-5" />
                          Cancel
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-700 text-sm leading-relaxed mb-4">
                        {member.bio || "No bio yet"}
                      </p>

                      {member.favorite_game && (
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                            🎮 Favorite Game
                          </p>
                          <p className="text-sm text-gray-800 font-medium">
                            {member.favorite_game}
                          </p>
                        </div>
                      )}

                      {member.quote && (
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 mb-4 border border-purple-100">
                          <p className="text-sm text-gray-700 italic">
                            &ldquo;{member.quote}&rdquo;
                          </p>
                        </div>
                      )}

                      {member.achievements &&
                        member.achievements.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">
                              🏆 Achievements
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {member.achievements.map((achievement, i) => (
                                <motion.span
                                  key={i}
                                  className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs font-medium"
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: i * 0.1 }}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  {achievement}
                                </motion.span>
                              ))}
                            </div>
                          </div>
                        )}
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {members.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUser className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-lg text-gray-600">
              No members yet. Create an account to become a member!
            </p>
          </div>
        )}
      </div>

      {/* Profile Code Editor Modal */}
      <ProfileCodeEditor
        key={currentEditingProfile?.id || "new"}
        isOpen={codeEditorOpen}
        onClose={() => {
          setCodeEditorOpen(false);
          setCurrentEditingProfile(null);
        }}
        initialHtml={currentEditingProfile?.custom_html || ""}
        initialCss={currentEditingProfile?.custom_css || ""}
        initialJs={currentEditingProfile?.custom_js || ""}
        onSave={handleSaveCustomCode}
      />

      {/* Profile Preview Modal */}
      <ProfilePreviewModal
        isOpen={previewModalOpen}
        onClose={() => {
          setPreviewModalOpen(false);
          setPreviewProfile(null);
        }}
        html={previewProfile?.custom_html || ""}
        css={previewProfile?.custom_css || ""}
        js={previewProfile?.custom_js || ""}
        memberName={previewProfile?.name || ""}
      />
    </main>
  );
}
