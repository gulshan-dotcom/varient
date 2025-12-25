import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import Banners from "@/models/Banners";

export async function DELETE(req) {
  await connectMongo();

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Banner ID required" }, { status: 400 });
    }

    const deleted = await Banners.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Banner deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
