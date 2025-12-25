import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import User from "@/models/User";
import Product from "@/models/Product";

export async function POST(request) {
  await connectMongo();
  const body = await request.json();
  const { productId, size, color } = body;
  const userEmail = request.headers.get("x-user-email");

  if (!userEmail) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const user = await User.findOne({ email: userEmail });
  const product = await Product.findById(productId);

  if (!user || !product) {
    return NextResponse.json(
      { error: "Invalid user or product" },
      { status: 404 }
    );
  }
  user.cart.push({
    productId: product._id,
    size,
    color,
    quantity: 1,
  });
  await user.save();
  return NextResponse.json({ success: true, user });
}
