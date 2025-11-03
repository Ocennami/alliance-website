import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabase";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Chặn đăng nhập bằng tài khoản đặc biệt - chỉ dùng để tạo account
        if (
          credentials.email === "username1@gmail.com" &&
          credentials.password === "11111111"
        ) {
          console.log("Special account detected - blocking login");
          return null;
        }

        try {
          // Đăng nhập với Supabase
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (error || !data.user) {
            console.error("Supabase auth error:", error);
            return null;
          }

          // Lấy thông tin user từ bảng profiles (nếu có)
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();

          return {
            id: data.user.id,
            email: data.user.email!,
            name: profile?.name || data.user.email?.split("@")[0] || "User",
            image: profile?.avatar_url || null,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/loginpage",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session: updateSession }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.picture = user.image;
      }

      // Update token when session.update() is called
      if (trigger === "update" && updateSession) {
        token.name = updateSession.user?.name || token.name;
        token.picture = updateSession.user?.image || token.picture;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;

        // Always fetch latest profile data from database
        const { data: profile } = await supabase
          .from("profiles")
          .select("name, avatar_url")
          .eq("id", token.id)
          .single();

        if (profile) {
          session.user.name = profile.name || session.user.name;
          session.user.image = profile.avatar_url || session.user.image;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
