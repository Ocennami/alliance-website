import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createClient } from "@supabase/supabase-js";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role key - bypass RLS
);

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const avatarFile = formData.get("avatar") as File | null;

    let avatarUrl = session.user.image;

    // Upload avatar if provided
    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const buffer = await avatarFile.arrayBuffer();
      const { error: uploadError } = await supabase.storage
        .from("user-uploads")
        .upload(filePath, buffer, {
          contentType: avatarFile.type,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("user-uploads").getPublicUrl(filePath);

      avatarUrl = publicUrl;
    }

    // Update profile
    const { error } = await supabase.from("profiles").upsert({
      id: session.user.id,
      name: name,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      avatarUrl,
      name,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Có lỗi xảy ra!" },
      { status: 500 }
    );
  }
}
