import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import Banners from "@/models/Banners";

export async function POST(req) {
  await connectMongo();
  const { bannerImage, name, link } = await req.json();

  if (!bannerImage || !name) {
    return NextResponse.json({ error: "Category name is required" }, { status: 400 });
  }

  const exists = await Banners.findOne({ name });
  if (exists) {
    return NextResponse.json({ error: "Category already exists" }, { status: 400 });
  }

  const banner = await Banners.create({
    image: bannerImage,
    text: name,
    link,
  });

  return NextResponse.json({ success: true, banner });
}
