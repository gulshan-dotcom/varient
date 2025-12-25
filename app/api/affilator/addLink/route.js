import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import User from "@/models/User";
import connectMongo from "@/lib/connectMongo";

export async function POST(req) {
  try {
    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Missing productId" },
        { status: 400 }
      );
    }
    
    await connectMongo();
    
    const userEmail = req.headers.get("x-user-email");
    
    const user = await User.findOne({ email: userEmail });

    if (!user || !user.affilator) {
      return NextResponse.json(
        { success: false, message: "Affilator not found" },
        { status: 404 }
      );
    }

    const alreadyLinked = user.affilator.links.some(
      (id) => id.toString() === productId
    );
    if (alreadyLinked) {
      return NextResponse.json(
        { success: false, message: "Product already linked" },
        { status: 400 }
      );
    }

    user.affilator.links.push(productId);
    await user.save();

    return NextResponse.json({ success: true, message: "Product link added" });
  } catch (error) {
    console.error("Add Link Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
