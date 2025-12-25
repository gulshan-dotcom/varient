"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import "@/stylesheets/admin/dashboard.css";
import { toast, ToastContainer } from "react-toastify";

const Page = () => {
  const [products, setProducts] = useState(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const res = await fetch("/api/user/products/getAll");
      const data = await res.json();

      if (data.success) {
        setIsLoadingProducts(false);
        setProducts(data.data);
      }
    };

    loadProducts();
  }, []);

  const DeleteItem = async (productId) => {
    const confirmation = confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmation) {
      return;
    }
    try {
      const response = await fetch("/api/admin/items/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (response.ok) {
        toast.success("Product deleted successfully!");
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product. Please try again.");
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.main
      className="adminDashboard"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="products-section">
        <div className="products-section-header">
          <h2>Products</h2>
          <div className="products-section-actions flex gap-2">
            <Link href="/admin/addItem" className="add-product-btn">
              Products
            </Link>
            <Link href="/admin/manageCategory" className="add-product-btn">
              Category
            </Link>
            <Link href="/admin/manageBanner" className="add-product-btn">
              Banners
            </Link>
          </div>
        </div>
        <div className="products-grid">
          {!isLoadingProducts &&
            products.map((product) => (
              <motion.div
                key={product._id}
                className="admin-product-card"
                data-id={product._id}
                variants={cardVariants}
                onClick={() => {}}
              >
                <Link href={`/user/item/details/${product._id}`}>
                  <Image
                    src={
                      product.images?.main[0].image || "/images/placeholder.jpg"
                    }
                    alt={product.title || "Product"}
                    width={200}
                    height={200}
                    className="product-card-image"
                  />
                  <div className="admin-product-card-content">
                    <h3>{product.title || "Product"}</h3>
                    <div className="category">
                      Category:{" "}
                      {product.categoryData.map((item) => (
                        <div
                          className="bg-slate-200 inline-block p-1 m-2.5 rounded-xl border-slate-500 border-2 text-slate-500"
                          key={item.categoryId + item.subcategory}
                        >
                          {item.categoryName}&mdash;&gt;{item.subcategory}
                        </div>
                      )) || "Unknown"}
                      {product.subcategory ? ` / ${product.subcategory}` : ""}
                    </div>
                    <p className="price">
                      &#8377;{product.currentPrice || "0"}
                    </p>
                    <p
                      className={`stock ${
                        product.inStock ? "in-stock" : "out-stock"
                      }`}
                    >
                      {product.inStock ? `In Stock` : "Out of Stock"}
                    </p>
                    <div className="colors">
                      {Object.keys(product.images || {})
                        .filter((key) => key !== "maincolor")
                        .map((color) => (
                          <span key={color} className="chip">
                            {color !== "main"
                              ? color
                              : product.images.maincolor || "Main Color"}
                          </span>
                        ))}
                    </div>
                    <div className="sizes">
                      {(product.sizes || []).map((size) => (
                        <span key={size} className="chip">
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
                <div className="admin-product-card-actions">
                  <button
                    className="action-btn delete"
                    onClick={() => DeleteItem(product._id)}
                  >
                    Delete
                  </button>
                  <button className="action-btn edit">
                    <Link href={`/admin/editItem/${product._id}`}>Edit</Link>
                  </button>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </motion.main>
  );
};

export default Page;
