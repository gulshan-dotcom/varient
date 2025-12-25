import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import Product from "@/models/Product";

export async function POST(req) {
  try {
    await connectMongo();
    const { query = "", limit = 12, page = 1 } = await req.json();

    if (!query.trim()) {
      return NextResponse.json({ success: true, data: [] });
    }

    const skip = (page - 1) * limit;

    const products = await Product.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { searchable: { $regex: query, $options: "i" } },
        { tag: { $regex: query, $options: "i" } },
      ],
      inStock: true,
    })
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (err) {
    console.error("SEARCH API ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Search failed" },
      { status: 500 }
    );
  }
}
