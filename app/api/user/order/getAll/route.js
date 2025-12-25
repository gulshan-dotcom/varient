import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import Order from "@/models/Orders";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectMongo();

    const email = req.headers.get("x-user-email");
    
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const orders = await Order.find({ user: user._id })
      .populate("items.product")
      .sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get Orders error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
