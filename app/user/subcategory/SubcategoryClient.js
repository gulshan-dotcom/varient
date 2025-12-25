"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer } from "react-toastify";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import { useData } from "@/components/DataContext";
import "@/stylesheets/user/subcategory.css";
import Link from "next/link";

export default function SubCategoryPage() {
  const { products, categories } = useData();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const subcategoryParam = searchParams.get("subcategory");

  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState({ name: "All" });

  useEffect(() => {
    if (categories.length > 0) {
      const cat =
        categories.find((c) => c.name === categoryParam) || categories[0];
      setActiveCategory(cat);
      const sub = subcategoryParam
        ? cat.subcategories.find((s) => s.name === subcategoryParam)
        : { name: "All", image: cat.image };
      setActiveSubcategory(sub || { name: "All", image: cat.image });
    }
  }, [categories, categoryParam, subcategoryParam]);

  const filteredProducts = useMemo(() => {
    if (!activeCategory) return [];
    return products.filter((product) => {
      const matchesCategory = product.categoryData?.some(
        (c) => c.categoryName === activeCategory.name
      );
      const matchesSubcategory =
        activeSubcategory.name === "All" ||
        product.categoryData?.some(
          (c) => c.subcategory === activeSubcategory.name
        );
      return matchesCategory && matchesSubcategory;
    });
  }, [products, activeCategory, activeSubcategory]);

  const handleSubcategorySelect = (sub) => {
    setActiveSubcategory(sub);
    router.push(
      `/user/subcategory?category=${activeCategory.name}&subcategory=${sub.name}`,
      { scroll: false }
    );
  };

  if (!activeCategory)
    return (
      <div className="min-h-screen bg-[#F3F5F8] flex items-center justify-center">
        Loading...
      </div>
    );

  const subcategoriesWithAll = [
    { name: "All", image: activeCategory.image },
    ...(activeCategory.subcategories || []),
  ];

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen bg-[#F3F5F8]">
        <section className="relative h-96 overflow-hidden">
          <Image
            src={activeCategory.image || "/hero-placeholder.jpg"}
            alt={activeCategory.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-center">
            <h1 className="text-4xl font-exo md:text-6xl font-bold mb-2">
              {activeCategory.name}
            </h1>
            <p className="text-lg md:text-xl mb-4">
              Explore premium collection
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-[#52b395] hover:text-white transition"
            >
              Home
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </section>

        <section className="py-6 bg-[#FFF8E7]">
          <div className="overflow-x-auto mx-auto scrollbar-hide px-4">
            <div className="flex gap-4 min-w-max">
              {subcategoriesWithAll.map((sub) => (
                <button
                  key={sub.name}
                  onClick={() => handleSubcategorySelect(sub)}
                  className={`scroll-shadow ${
                    activeSubcategory.name === sub.name && "active"
                  }`}
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#d3d3d3]">
                    <Image
                      src={sub.image || "/placeholder.jpg"}
                      alt={sub.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-[#374151]">
                    {sub.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="products" className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-8 flex-col lg:flex-row">
            <div className="flex-1">
              <div className="mb-6 flex justify-between items-center px-4 md:px-0">
                <h2 className="text-2xl font-bold text-[#0D1527]">
                  {activeSubcategory.name}
                </h2>
                <p className="text-sm text-[#6b7280]">
                  {filteredProducts.length} items
                </p>
              </div>

              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    showUserActions={true}
                  />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <p className="text-center text-gray-500 py-12 px-4">
                  No products found.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
