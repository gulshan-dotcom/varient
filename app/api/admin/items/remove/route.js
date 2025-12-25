import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectMongo from "@/lib/connectMongo";

export async function DELETE(req) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    await connectMongo();
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
