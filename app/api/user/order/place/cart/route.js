import { NextResponse } from "next/server";
import User from "@/models/User";
import connectMongo from "@/lib/connectMongo";

export async function POST(req) {
  try {
    await connectMongo();

    const email = req.headers.get("x-user-email");
    const authHeader = req.headers.get("Authorization");

    if (!email) {
      return NextResponse.json(
        { error: "Missing x-user-email header" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).populate("cart.productId");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.cart || user.cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    let placedOrders = [];

    // 🔁 har cart item ke liye loop
    for (const item of user.cart) {
      for (let i = 0; i < item.quantity; i++) {
        // body banani hai jaise aap /api/user/place me bhejte ho
        const body = {
          productId: item.productId._id,
          size: item.size,
          color: item.color,
          address: user.address
        };

        // internal fetch call
        const res = await fetch(`${process.env.BASE_URL}/api/user/order/place`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-email": email,
            Authorization: authHeader,
            "x-internal-secret": process.env.INTERNAL_API_SECRET
          },
          body: JSON.stringify(body),
        });

        const data = await res.json();

        if (res.ok) {
          placedOrders.push(data);
        } else {
          console.error("Order placement failed:", data);
        }
      }
    }

    return NextResponse.json({
      success: true,
      orders: placedOrders,
    });
  } catch (error) {
    console.error("Place cart error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
