import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Affilator from "@/models/Affilator"; // Mongoose model
import connectMongo from "@/lib/connectMongo";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, name, picture } = body;

    if (!email || !name) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    await connectMongo();

    let user = await Affilator.findOne({ email });

    if (!user) {
      const userId = email.split("@")[0];
      const cleaned = userId.replace(/[0-9]/g, "").replace(/\s+/g, "");
      const username =
        cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
      user = await Affilator.create({
        username,
        email,
        image: picture,
        id: userId,
        isActive: false,
      });
    }

    const jwtToken = jwt.sign(
      {
        email: user.email,
        name: user.name,
        picture: user.picture,
        _id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 * 24 * 30 }
    );

    return NextResponse.json({
      success: true,
      token: jwtToken,
      expiry: Date.now() + 60 * 60 * 24 * 30,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
