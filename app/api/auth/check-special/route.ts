import { NextRequest, NextResponse } from "next/server";

// Server-side only - credentials not exposed to client
const SPECIAL_ACCOUNT = {
  email: process.env.SPECIAL_ACCOUNT_EMAIL || "username1@gmail.com",
  password: process.env.SPECIAL_ACCOUNT_PASSWORD || "11111111",
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Check if it's the special account
    const isSpecialAccount =
      email === SPECIAL_ACCOUNT.email && password === SPECIAL_ACCOUNT.password;

    return NextResponse.json({
      isSpecialAccount,
    });
  } catch (error) {
    console.error("Error checking special account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
