import { NextResponse } from "next/server";
import Category from "@/models/Category";
import connectMongo from "@/lib/connectMongo";

export async function POST(req) {
  await connectMongo();
  const { categoryName } = await req.json();

  const category = await Category.findOne({ name: categoryName });
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  category.hidden = !category.hidden;
  await category.save();

  return NextResponse.json({ success: true, category });
}
