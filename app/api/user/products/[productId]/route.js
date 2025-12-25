import { NextResponse } from "next/server";
import Product from "@/models/Product";
import mongoose from "mongoose";
import connectMongo from "@/lib/connectMongo";

export async function GET(req, { params }) {
  try {
    await connectMongo();

    const { productId } = await params;

    // ❌ Invalid MongoDB ObjectId guard
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { message: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId).lean();

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Get Product Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
