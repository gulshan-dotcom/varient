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
    console.log(user,product)
    return NextResponse.json(
      { error: "Invalid user or product" },
      { status: 404 }
    );
  }
  user.cart = user.cart.filter(
    (item) =>
      !(
        item.productId.toString() === product._id.toString() &&
        item.size === size &&
        item.color === color
      )
  );
  await user.save();
  return NextResponse.json({ success: true, user });
}
