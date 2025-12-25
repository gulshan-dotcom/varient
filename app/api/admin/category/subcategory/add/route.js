import Category from "@/models/Category";
import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";

export async function POST(req) {
  await connectMongo();
  const { categoryName, subcategoryName, subcategoryImage } = await req.json();

  const category = await Category.findOne({ name: categoryName });
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  // check agar subcategory already exist hai
  const exists = category.subcategories.some(
    (sub) => sub.name === subcategoryName
  );
  if (exists) {
    return NextResponse.json(
      { error: "Subcategory already exists" },
      { status: 400 }
    );
  }

  // push as object
  category.subcategories.push({
    name: subcategoryName,
    image: subcategoryImage || "", // default image
  });

  await category.save();

  return NextResponse.json({ success: true, category });
}
