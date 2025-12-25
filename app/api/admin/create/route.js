import { NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from 'bcrypt';
import connectMongo from "@/lib/connectMongo";

export async function POST(req) {
  if (process.env.NODE_ENV === "development") {
    try {
      const body = await req.json();

      const { email, password, secret, username } = body;

      if (!email || !password || !secret) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      if (secret != process.env.ADMIN_SECRET) {
        return NextResponse.json(
          { error: "you're not an admin" },
          { status: 400 }
        );
      }

      await connectMongo();
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { error: "Admin already exists" },
          { status: 409 }
        );
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = await User.create({
        email,
        password: hashedPassword,
        username,
        isAdmin: true,
      });

      return NextResponse.json({ user: newUser }, { status: 201 });
    } catch (error) {
      console.error("User creation error:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
  return NextResponse.json({ error: "environment does not supported" }, { status: 500 });
}
