import Category from "@/models/Category";
import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";

export async function POST(req) {
  await connectMongo();
  const { categoryName, categoryImage, subcategoryName } = await req.json();

  if (!categoryName) {
    return NextResponse.json({ error: "Category name is required" }, { status: 400 });
  }

  const exists = await Category.findOne({ name: categoryName });
  if (exists) {
    return NextResponse.json({ error: "Category already exists" }, { status: 400 });
  }
  console.log(subcategoryName);

  const formattedSubcategories = [{
    name: subcategoryName,
    image: ""
  }]

  const category = await Category.create({
    name: categoryName,
    image: categoryImage || "",
    subcategories: formattedSubcategories,
  });

  return NextResponse.json({ success: true, category });
}
