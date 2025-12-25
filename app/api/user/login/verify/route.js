import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

async function verifyJWT(token) {
  try {
     const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}

export async function POST(req) {
  try {
    const authHeader = req.headers.get("Authorization");

    const token = authHeader.split(" ")[1];
    console.log("Token:", token);
    const payload = await verifyJWT(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success:true }, { status: 200 });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
