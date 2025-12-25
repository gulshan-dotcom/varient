import Category from "@/models/Category";
import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";

export async function POST(req) {
  await connectMongo();
  const { categoryName, categoryImage, subcategoryName } = await req.json();

  if (!categoryName || !subcategoryName) {
    return NextResponse.json(
      { error: "Category name and subcategory name is required" },
      { status: 400 }
    );
  }

  const category = await Category.findOneAndUpdate(
    {
      name: categoryName,
      "subcategories.name": subcategoryName,
    },
    {
      $set: { "subcategories.$.image": categoryImage },
    },
    { new: true }
  );

  return NextResponse.json({ success: true, category });
}
