import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import Product from "@/models/Product";

export async function POST(req) {
  try {
    await connectMongo();
    const { query = "" } = await req.json();

    if (query.length === 0) {
      const products = await Product.find({ inStock: true })
        .select("searchable")
        .limit(3)
        .sort({ createdAt: -1 })
        .lean();

      const keywordSet = new Set();

      products.forEach((p) => {
        if (Array.isArray(p.searchable)) {
          p.searchable.forEach((k) => keywordSet.add(k));
        }
      });

      return NextResponse.json({
        success: true,
        data: Array.from(keywordSet).slice(0, 12),
      });
    }

    const suggestions = await Product.aggregate([
      { $unwind: "$searchable" },
      { $match: { searchable: { $regex: query, $options: "i" } } },
      { $group: { _id: "$searchable" } },
      { $limit: 10 },
    ]);

    return NextResponse.json({
      success: true,
      data: suggestions.map((s) => s._id),
    });
  } catch (err) {
    console.error("SEARCH API ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Search failed" },
      { status: 500 }
    );
  }
}
