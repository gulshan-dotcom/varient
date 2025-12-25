import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { SignJWT } from 'jose';

const generateToken = async (user) => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const token = await new SignJWT({
    userId: user._id.toString(),
    email: user.email,
    isAdmin: user.isAdmin,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);

  return token;
};

export async function POST(req) {
  try {
    await connectMongo();
    const { email, password, secret } = await req.json();

    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { message: "Invalid secret key." },
        { status: 403 }
      );
    }

    const user = await User.findOne({ email });

    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { message: "Admin not found or unauthorized." },
        { status: 404 }
      );
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = await generateToken(user);

    const response = NextResponse.json({ message: "Login successful! Redirecting..." });

    response.cookies.set("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
