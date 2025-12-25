import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectMongo();

    let categories = await Category.find();

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
