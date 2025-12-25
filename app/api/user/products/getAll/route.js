import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectMongo();

    const products = await Product.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("GET ALL PRODUCTS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load products" },
      { status: 500 }
    );
  }
}
