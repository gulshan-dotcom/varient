import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import User from "@/models/User";

export async function GET() {
  try {
    await connectMongo();

    let affilators = await User.find({ "affilator.isLoggedIn": true });

    return NextResponse.json({ affilators }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
