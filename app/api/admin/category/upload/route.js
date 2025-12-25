import Category from "@/models/Category";
import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";

export async function POST(req) {
  await connectMongo();
  const { categoryName, categoryImage } = await req.json();

  if (!categoryName) {
    return NextResponse.json(
      { error: "Category name is required" },
      { status: 400 }
    );
  }

  const category = await Category.findOneAndUpdate(
    { name: categoryName },
    { image: categoryImage }, 
    { new: true } 
  );

  return NextResponse.json({ success: true, category });
}
