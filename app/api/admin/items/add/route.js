import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectMongo from "@/lib/connectMongo";

export async function POST(req) {
  await connectMongo();
  try {
    const body = await req.json();
    const product = await Product.create(body);
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
