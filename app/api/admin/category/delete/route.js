import Category from "@/models/Category";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";

export async function DELETE(req) {
  await connectMongo();
  const { categoryName } = await req.json();

  const usingProducts = await Product.findOne({ category: categoryName });
  if (usingProducts) {
    return NextResponse.json(
      { error: "Cannot delete: Products use this category" },
      { status: 400 }
    );
  }

  const deleted = await Category.findOneAndDelete({ name: categoryName });
  if (!deleted)
    return NextResponse.json({ error: "Category not found" }, { status: 404 });

  return NextResponse.json({ success: true });
}
