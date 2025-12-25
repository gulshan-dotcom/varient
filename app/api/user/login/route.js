import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "@/models/User"; // Your Mongoose model
import connectMongo from "@/lib/connectMongo";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req) {
  try {
    const { googleAcessToken } = await req.json();

    if (!googleAcessToken) {
      return NextResponse.json(
        { success: false, message: "Missing googleAcessToken" },
        { status: 400 }
      );
    }

    const userInfoRes = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${googleAcessToken}`,
        },
      }
    );

    if (!userInfoRes.ok) {
      throw new Error("Failed to fetch user info from Google");
    }

    const payload = await userInfoRes.json();

    const { email, name, picture, sub: googleId } = payload;

    await connectMongo();

    let user = await User.findOne({ email });

    if (!user) {
      const userId = email.split("@")[0];
      const cleaned = userId.replace(/[0-9]/g, "").replace(/\s+/g, "");
      const username =
        cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();

      user = await User.create({
        email,
        username: name || username,
        id: userId,
        image: picture,
      });
    }

    const jwtToken = jwt.sign(
      {
        email: user.email,
        username: user.username,
        _id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    console.log({
      success: true,
      token: jwtToken,
      expiry: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 days
      user,
    });

    return NextResponse.json({
      success: true,
      token: jwtToken,
      expiry: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 days
      user,
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
