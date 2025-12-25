import { NextResponse } from "next/server";
import Product from "@/models/Product";
import Category from "@/models/Category";
import connectMongo from "@/lib/connectMongo";

export async function GET() {
  try {
    await connectMongo();

    // 1️⃣ Categories (only visible)
    const categories = await Category.find(
      { hidden: false },
      { name: 1 }
    ).lean();

    // 2️⃣ Products – only required fields
    const products = await Product.find();

    // 3️⃣ Category wise products (backend me filter)
    const categoryMap = categories.map((cat) => ({
      _id: cat._id,
      name: cat.name,
      products: products.filter((product) =>
        product.categoryData?.some((c) => c.categoryName === cat.name)
      ),
    }));

    // 4️⃣ Featured products
    const featuredProducts = products.filter(
      (p) => p.tag && !["none", "None"].includes(p.tag) && p.tag.length > 0
    );

    return NextResponse.json({
      categories: categoryMap,
      featuredProducts,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
