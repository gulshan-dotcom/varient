import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { email } = await req.json();

    await connectMongo();

    const user = await User.findOne({ email });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.log(error.message)
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
