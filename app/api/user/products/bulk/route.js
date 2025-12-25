import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectMongo from "@/lib/connectMongo";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await connectMongo();

    const { productIds } = await req.json();

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "productIds array required" },
        { status: 400 }
      );
    }

    // validate ObjectIds
    const validIds = productIds.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    const products = await Product.find({
      _id: { $in: validIds },
    });

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
