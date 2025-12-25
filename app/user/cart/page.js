"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import "@/stylesheets/user/cart.css";
import { useData } from "@/components/DataContext";
import { useSession } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";

// Delivery Icon SVG Component
const DeliveryIcon = ({ color = "#fbc886", size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g data-name="fast delivery">
      <path
        d="M59.18 24.83 55.15 49H28a1 1 0 0 0 0 2h28a1 1 0 0 0 1-.84l4.17-25a1 1 0 0 0-1.99-.33zM62.76 13.35C62.29 12.8 65.57 13 15 13a1 1 0 0 0 0 2h3.82l-.5 3H7a1 1 0 0 0 0 2h11a1 1 0 0 0 2 .16c0-.23-1-.16 10-.16a1 1 0 0 0 0-2h-9.65l.5-3h14.82c-1.78 6.25-1.87 6.07-1.47 6.6s.15.4 10.8.4a1 1 0 0 0 1-.73L47.75 15h13.07l-1 6a1 1 0 0 0 2 .33c1.24-7.61 1.36-7.48.94-7.98zM44.25 20h-7.92l1.42-5h7.92zM2 49a1 1 0 0 0 0 2 1 1 0 0 0 0-2zM24 30h-5.65l1-5.95a1 1 0 0 0-2-.32l-1 6.27H12a1 1 0 0 0 0 2h4l-.66 4H8a1 1 0 0 0 0 2h7l-1.85 11H6a1 1 0 0 0 0 2h13a1 1 0 0 0 0-2h-3.82L17 38h3a1 1 0 0 0 0-2h-2.65l.65-4h6a1 1 0 0 0 0-2zM4 36a1 1 0 0 0 0 2 1 1 0 0 0 0-2zM3 20a1 1 0 0 0 0-2 1 1 0 0 0 0 2z"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M43 46h8a1 1 0 0 0 0-2h-8a1 1 0 0 0 0 2zM52 41a1 1 0 0 0 0-2h-8a1 1 0 0 0 0 2zM24 49h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2z"
        stroke={color}
        strokeWidth="2"
      />
    </g>
  </svg>
);

// Remove Icon SVG Component
const RemoveIcon = ({ color = "#ef4444" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={color}
    width="14"
    height="14"
  >
    <path d="M7 4V2H17V4H22V6H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V6H2V4H7ZM6 6V20H18V6H6ZM9 9H11V17H9V9ZM13 9H15V17H13V9Z" />
  </svg>
);

// Main CartScreen Component
const CartScreen = () => {
  const router = useRouter();
  const { dbUser, reload } = useData();
  const { data: session, status } = useSession();
  const [products, setProducts] = useState([]);

  const [quantities, setQuantities] = useState(
    dbUser?.cart?.reduce(
      (acc, item) => ({
        ...acc,
        [`${item.productId}-${item.size}-${item.color}`]: item.quantity,
      }),
      {}
    )
  );

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.replace(`/user/login`);
    }
  }, [status, router, session]);

  // Sync quantities with dbUser?.cart changes
  useEffect(() => {
    setQuantities(
      dbUser?.cart?.reduce(
        (acc, item) => ({
          ...acc,
          [`${item.productId}-${item.size}-${item.color}`]: item.quantity,
        }),
        {}
      )
    );
  }, [dbUser?.cart]);

  // Handle quantity change with backend sync
  const handleQuantityChange = async (cartItem, delta) => {
    const key = `${cartItem.productId}-${cartItem.size}-${cartItem.color}`;
    const currentQuantity = quantities[key] || 1;
    const newQuantity = Math.max(1, currentQuantity + delta);

    // ✅ 1. UI me pehle update kar do
    setQuantities((prev) => ({
      ...prev,
      [key]: newQuantity,
    }));

    try {
      // ✅ 2. Server ko background me request bhejo
      const response = await fetch("/api/user/cart/updateQty", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": dbUser?.email || "",
        },
        body: JSON.stringify({
          productId: cartItem.productId,
          size: cartItem.size,
          color: cartItem.color,
          quantity: newQuantity,
        }),
      });

      const data = await response.json();

      // ❌ 3. Agar server error de, to rollback kar do
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to update cart quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity. Rolling back...");

      // 🔁 Rollback UI
      setQuantities((prev) => ({
        ...prev,
        [key]: currentQuantity,
      }));
    }
  };

  // Handle item removal with backend sync
  const handleRemoveItem = async (cartItem) => {
    const key = `${cartItem.productId}-${cartItem.size}-${cartItem.color}`;
    try {
      const response = await fetch("/api/user/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": dbUser?.email || "",
        },
        body: JSON.stringify({
          productId: cartItem.productId,
          size: cartItem.size,
          color: cartItem.color,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to remove item from cart");
      }

      setQuantities((prev) => {
        const newQuantities = { ...prev };
        delete newQuantities[key];
        return newQuantities;
      });
      reload("dbUser");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error(error.message || "Could not remove item. Please try again.");
    }
  };

  // Calculate totals
  const netPrice = dbUser?.cart.reduce((total, cartItem) => {
    const product = products?.find((p) => p._id === cartItem.productId);
    return (
      total +
      (product?.currentPrice || 0) *
        quantities[`${cartItem.productId}-${cartItem.size}-${cartItem.color}`]
    );
  }, 0);
  const isFirstOrder = dbUser?.Orders.length === 0;
  const discount = Math.round(netPrice * (isFirstOrder ? 0.15 : 0.1));
  const total = netPrice - discount;

  useEffect(() => {
    if (!dbUser?.cart || dbUser.cart.length === 0) {
      setProducts([]);
      return;
    }

    const loadCartProducts = async () => {
      try {
        const uniqueProductIds = [
          ...new Set(dbUser.cart.map((item) => item.productId)),
        ];

        const res = await fetch("/api/user/products/bulk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productIds: uniqueProductIds,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load cart products");
        }

        setProducts(data.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load cart products");
      }
    };

    loadCartProducts();
  }, [dbUser?.cart]);

  // Get product image
  const getProductImage = (images, color) => {
    if (!images) return "https://via.placeholder.com/80x80";
    const keys = Object.keys(images);
    console.log("returning: keys color", images[color], color);
    return (
      images[color]?.[0].image ||
      images[keys[0]]?.[0].image ||
      "https://via.placeholder.com/80x80"
    );
  };

  return (
    <main className="main">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container">
        <h2 className="total-items-header">
          Total Items: <span>{dbUser?.cart.length || 0}</span>
        </h2>
        <div className="cart-layout">
          <section className="cart-items-list">
            {dbUser?.cart.length === 0 ? (
              <div className="empty-cart">
                <h3>Your cart is empty</h3>
                <Link href="/" className="shop-now-btn">
                  Shop Now
                </Link>
              </div>
            ) : (
              dbUser?.cart.map((cartItem, index) => {
                const product = products?.find(
                  (p) => p._id === cartItem.productId
                );
                if (!product) return null;
                return (
                  <div key={index} className="cart-item-card">
                    <Link href={`/user/item/details/${product._id}`}>
                      <div className="item-image-container">
                        <Image
                          src={getProductImage(product.images, cartItem.color)}
                          alt={product.title}
                          width={80}
                          height={80}
                          className="item-image"
                        />
                      </div>
                    </Link>
                    <div className="item-details">
                      <h4>{product.title}</h4>
                      <div className="item-options">
                        <div>
                          Size: <span>{cartItem.size}</span>
                        </div>
                        <div>
                          {console.log(cartItem)}
                          Color:{" "}
                          <span>
                            {cartItem.color === "main"
                              ? product.images.maincolor
                              : cartItem.color}
                          </span>
                        </div>
                      </div>
                      <div className="item-pricing">
                        <p className="item-price">₹{product.currentPrice}</p>
                        {product.oldPrice && (
                          <p className="original-price">₹{product.oldPrice}</p>
                        )}
                        <span className="discount-badge">
                          {isFirstOrder ? "15% OFF" : "10% OFF"}
                        </span>
                      </div>
                    </div>
                    <div className="item-actions-group">
                      <div className="quantity-control">
                        <button
                          className="qty-btn"
                          aria-label="Decrement Quantity"
                          onClick={() => handleQuantityChange(cartItem, -1)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M18 12H6"
                            />
                          </svg>
                        </button>
                        <input
                          type="number"
                          value={
                            quantities[
                              `${cartItem.productId}-${cartItem.size}-${cartItem.color}`
                            ] || 1
                          }
                          min="1"
                          max="10"
                          readOnly
                          className="quantity-input"
                          aria-label="Item Quantity"
                        />
                        <button
                          className="qty-btn"
                          aria-label="Increment Quantity"
                          onClick={() => handleQuantityChange(cartItem, 1)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4.5v15m7.5-7.5h-15"
                            />
                          </svg>
                        </button>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveItem(cartItem)}
                      >
                        <RemoveIcon />
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </section>
          {dbUser?.cart.length > 0 && (
            <aside className="summary-actions">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span className="summary-label">
                  Subtotal ({dbUser?.cart.length} items)
                </span>
                <span className="summary-value">₹{netPrice}</span>
              </div>
              <div className="summary-row discount">
                <span className="summary-label">Discount</span>
                <span className="summary-value">-₹{discount.toFixed(1)}</span>
              </div>
              <div className="summary-row shipping">
                <span className="summary-label">Shipping Charges</span>
                <span className="summary-value">FREE</span>
              </div>
              <div className="free-delivery-banner">
                <DeliveryIcon />
                <span>FREE DELIVERY!</span>
              </div>
              <div className="summary-row total">
                <span className="summary-label">Order Total</span>
                <span className="summary-value">₹{total}</span>
              </div>
              <Link href="/user/cart/checkout" className="btn-primary">
                Proceed to Checkout
              </Link>
              <Link href="/" className="continue-shopping">
                ← Continue Shopping
              </Link>
            </aside>
          )}
        </div>
      </div>
    </main>
  );
};

export default CartScreen;
