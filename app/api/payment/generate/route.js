import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { amount, currency = "INR", receipt } = await req.json();

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    let options = {
      amount: amount * 100,
      currency,
      receipt: receipt || "receipt_" + Date.now(),
    };

    const usermail = req.headers.get("x-user-email");
    if (!usermail) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }
    const user = await User.findOne({ email: usermail });
    // if (user.Orders.length === 0) {
    //   options.amount = Math.round(amount - (amount / 100 * 15));
    // }else{
    //   options.amount = Math.round(amount - (amount / 100 * 10));
    // }

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Razorpay order error", err);
    return NextResponse.json({ error: "Razorpay error" }, { status: 500 });
  }
}
