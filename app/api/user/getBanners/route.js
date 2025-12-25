import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import Banners from "@/models/Banners";

export async function GET() {
  try {
    await connectMongo();

    let banners = await Banners.find();

    return NextResponse.json({ banners }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
