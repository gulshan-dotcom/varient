import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import Product from "@/models/Product";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await connectMongo();

    const { categoryMap = {} } = await req.json();

    if (!Object.keys(categoryMap).length) {
      return NextResponse.json(
        { success: false, message: "categoryMap is required" },
        { status: 400 }
      );
    }

    let allProducts = [];

    for (const [categoryId, limit] of Object.entries(categoryMap)) {
      const products = await Product.find({
        "categoryData.categoryId": new mongoose.Types.ObjectId(categoryId),
        inStock: true,
      })
        .limit(Number(limit))
        .sort({ createdAt: -1 })
        .lean();

      allProducts.push(...products);
    }

    // 🧹 Deduplicate by product _id
    const uniqueProductsMap = new Map();
    allProducts.forEach((p) => uniqueProductsMap.set(p._id.toString(), p));

    const uniqueProducts = Array.from(uniqueProductsMap.values());

    return NextResponse.json({
      success: true,
      count: uniqueProducts.length,
      data: uniqueProducts,
    });
  } catch (error) {
    console.error("RECOMMENDED PRODUCTS API ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load recommendations" },
      { status: 500 }
    );
  }
}
