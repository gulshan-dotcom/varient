// 📁 /app/api/admin/items/update/[id]/route.js

import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectMongo from "@/lib/connectMongo";

export async function PUT(req, { params }) {
  await connectMongo();
  const { id } = await params;

  try {
    const body = await req.json();

    const updatedProduct = await Product.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
