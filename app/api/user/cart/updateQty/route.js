import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import User from "@/models/User";
import Product from "@/models/Product";

export async function PUT(request) {
  try {
    await connectMongo();
    const body = await request.json();
    const { productId, size, color, quantity } = body;
    const userEmail = request.headers.get("x-user-email");

    if (!userEmail) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    if (!productId || quantity < 1) {
      return NextResponse.json(
        { error: "Invalid product ID or quantity" },
        { status: 400 }
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

    // Check if the item exists in the cart
    const cartItemIndex = user.cart.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (cartItemIndex >= 0) {
      // Update existing item quantity
      user.cart[cartItemIndex].quantity = quantity;
    } else {
      // Add new item to cart
      user.cart.push({
        productId,
        size: size || null,
        color: color || null,
        quantity,
      });
    }

    await user.save();
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
