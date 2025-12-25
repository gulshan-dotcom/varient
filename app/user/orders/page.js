"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import "@/stylesheets/user/orders.css";
import { toast, ToastContainer } from "react-toastify";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useData } from "@/components/DataContext";

// Main YourOrdersScreen Component
const YourOrdersScreen = () => {
  const router = useRouter();
  const { dbUser } = useData();
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.replace(`/user/login`);
    }
  }, [status, router, session]);

  useEffect(() => {
    if (!dbUser) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/user/order/getAll", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-user-email": dbUser?.email || "",
          },
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to fetch orders");
        }

        setOrders(data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error(
          error.message || "Could not fetch orders. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [dbUser]);

  const orderedProducts = [];

  const getProductImage = (productId, color) => {
    const product = products.find((p) => p._id === productId);
    if (!product || !product.images)
      return "https://via.placeholder.com/80x100";
    const keys = Object.keys(product.images);
    return (
      product.images[color]?.[0].image ||
      product.images[keys[0]]?.[0].image ||
      "https://via.placeholder.com/80x100"
    );
  };

  const getProductTitle = (productId) => {
    const product = products.find((p) => p._id === productId);
    return product?.title || "Unknown Product";
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return {
          backgroundColor: "#22c55e",
          color: "#ffffff",
        };
      case "Shipped":
        return {
          backgroundColor: "#52b395",
          color: "#ffffff",
        };
      case "Cancelled":
        return {
          backgroundColor: "#ef4444",
          color: "#ffffff",
        };
      default:
        return {
          backgroundColor: "#6b7280",
          color: "#ffffff",
        };
    }
  };

  return (
    <main className="main">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container">
        <section className="orders-list">
          <h1 className="section-title">Your Orders</h1>
          {loading ? (
            <p className="loading-text">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="empty-orders">
              <svg width="256" height="160" viewBox="0 0 433 559" fill="none">
                <path
                  d="M278 411H376.905H394C394 399.367 373.853 396.918 365.305 392.633C356.758 388.347 351.874 381 340.884 381C329.895 381 317.074 395.694 302.421 396.918C290.699 397.898 281.256 406.714 278 411Z"
                  fill="#1a1a1a"
                  fillOpacity="0.6"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M168.026 452.826L184.979 389.558L186.91 390.076L169.958 453.344L168.026 452.826Z"
                  fill="#d6e2fb"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M168.026 452.826L184.979 389.558L186.91 390.076L169.958 453.344L168.026 452.826Z"
                  fill="url(#paint0_linear)"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M214.386 396.738L215.461 398.425L178.779 421.802L198.858 460.388L197.084 461.311L176.159 421.1L214.386 396.738Z"
                  fill="#d6e2fb"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M214.386 396.738L215.461 398.425L178.779 421.802L198.858 460.388L197.084 461.311L176.159 421.1L214.386 396.738Z"
                  fill="url(#paint1_linear)"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M157.854 381.591L156.08 382.514L176.159 421.1L139.477 444.477L140.552 446.164L178.779 421.802L157.854 381.591Z"
                  fill="#d6e2fb"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M157.854 381.591L156.08 382.514L176.159 421.1L139.477 444.477L140.552 446.164L178.779 421.802L157.854 381.591Z"
                  fill="url(#paint2_linear)"
                />
                <rect
                  x="175.033"
                  y="411.222"
                  width="10"
                  height="19"
                  rx="2"
                  transform="rotate(15 175.033 411.222)"
                  fill="#52b395"
                />
                <rect
                  x="175.033"
                  y="411.222"
                  width="10"
                  height="19"
                  rx="2"
                  transform="rotate(15 175.033 411.222)"
                  fill="url(#paint3_linear)"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M185.135 362.165L149.568 352.635L149.381 352.585L149.277 352.422C137.811 334.549 121.305 303.062 108.321 266.461C95.3383 229.866 86.0941 188.176 89.6654 150.043C94.1353 102.315 121.144 69.4602 157.326 51.3142C193.491 33.1765 238.817 29.7315 279.991 40.764C321.165 51.7965 358.695 77.4428 380.946 111.233C403.208 145.039 410.171 186.996 390.178 230.565C374.204 265.375 345.354 296.857 315.813 322.058C286.268 347.263 256.354 366.313 237.489 376.058L237.317 376.147L237.13 376.097L195.765 365.013L185.135 362.165Z"
                  fill="#d6e2fb"
                />
                <path
                  d="M149.338 352.573C179.997 353.968 209.988 362.004 237.237 376.125L234.866 378.144C227.675 384.265 222.516 392.428 220.072 401.549L151.491 383.173C153.935 374.052 153.548 364.403 150.382 355.506L149.338 352.573Z"
                  fill="#d6e2fb"
                />
                <path
                  d="M149.338 352.573C179.997 353.968 209.988 362.004 237.237 376.125L234.866 378.144C227.675 384.265 222.516 392.428 220.072 401.549L151.491 383.173C153.935 374.052 153.548 364.403 150.382 355.506L149.338 352.573Z"
                  fill="url(#paint5_linear)"
                />
                <rect
                  width="44"
                  height="69"
                  transform="matrix(-0.965926 -0.258819 -0.258819 0.965926 232.295 467.976)"
                  fill="#52b395"
                />
                <rect
                  width="44"
                  height="69"
                  transform="matrix(-0.965926 -0.258819 -0.258819 0.965926 232.295 467.976)"
                  fill="url(#paint6_linear)"
                />
                <rect
                  x="112.52"
                  y="435.883"
                  width="80"
                  height="69"
                  transform="rotate(15 112.52 435.883)"
                  fill="#52b395"
                />
                <rect
                  x="111.826"
                  y="477.108"
                  width="29"
                  height="19"
                  rx="2"
                  transform="rotate(15 111.826 477.108)"
                  fill="#d6e2fb"
                />
                <rect
                  x="112.395"
                  y="486.578"
                  width="16"
                  height="2"
                  rx="1"
                  transform="rotate(15 112.395 486.578)"
                  fill="#52b395"
                />
                <path
                  d="M204.283 460.471L216.84 463.835L213.734 475 meh426C213.449 476.493 212.352 477.127 211.285 476.841L202.592 474.511C201.525 474.225 200.891 473.129 201.177 472.062L204.283 460.471Z"
                  fill="#d6e2fb"
                  fillOpacity="0.2"
                />
                <rect
                  x="111.359"
                  y="490.441"
                  width="12"
                  height="2"
                  rx="1"
                  transform="rotate(15 111.359 490.441)"
                  fill="#52b395"
                />
                <path
                  d="M116.5 39.5H35.5H21.5C21.5 30 38 28 45 24.5C52 21 56 15 65 15C74 15 84.5 27 96.5 28C106.1 28.8 113.833 36 116.5 39.5Z"
                  fill="#1a1a1a"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear"
                    x1="185.944"
                    y1="389.817"
                    x2="168.992"
                    y2="453.085"
                  >
                    <stop stopColor="#9ab7f6" />
                    <stop offset="1" stopColor="#9ab7f6" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear"
                    x1="200.311"
                    y1="392.967"
                    x2="183.008"
                    y2="457.54"
                  >
                    <stop stopColor="#9ab7f6" />
                    <stop offset="1" stopColor="#9ab7f6" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    id="paint2_linear"
                    x1="171.93"
                    y1="385.362"
                    x2="154.627"
                    y2="449.935"
                  >
                    <stop stopColor="#9ab7f6" />
                    <stop offset="1" stopColor="#9ab7f6" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    id="paint3_linear"
                    x1="180.033"
                    y1="403.222"
                    x2="180.033"
                    y2="430.222"
                  >
                    <stop stopColor="#1a1a1a" />
                    <stop offset="1" stopColor="#1a1a1a" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    id="paint5_linear"
                    x1="211.663"
                    y1="295.768"
                    x2="185.781"
                    y2="392.361"
                  >
                    <stop stopColor="#52b395" />
                    <stop offset="1" stopColor="#52b395" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    id="paint6_linear"
                    x1="22"
                    y1="-28.5"
                    x2="22"
                    y2="69"
                  >
                    <stop stopColor="#1a1a1a" />
                    <stop offset="1" stopColor="#1a1a1a" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <h3 className="empty-orders-title">No orders yet</h3>
              <Link href="/" className="shop-now-btn">
                Shop Now
              </Link>
            </div>
          ) : (
            orders.map((order, index) => (
              <div key={index} className="order-card">
                <Link href={`/user/item/details/${order.items[0].product._id}`}>
                  <div className="order-image-container">
                    <Image
                      src={getProductImage(
                        order.items[0].product._id,
                        order.items[0].color
                      )}
                      alt={getProductTitle(order.items[0].product._id)}
                      width={80}
                      height={100}
                      className="order-image"
                    />
                  </div>
                </Link>
                <div className="details">
                  <h3 className="order-title">
                    {getProductTitle(order.items[0].product._id)}
                  </h3>
                  <p className="price">₹{order.totalAmount}</p>
                  <div className="status">
                    <span className="status-text">Order Status:</span>
                    <span
                      className="status-tag"
                      style={getStatusStyle(order.status)}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="detail-text">
                    Size: {order.items[0].size || "N/A"}
                  </p>
                  <p className="detail-text">
                    Color: {order.items[0].color || "N/A"}
                  </p>
                  <div className="actions">
                    <Link
                      href={`/user/orders/track/${order.OrderId}`}
                      className="track-btn"
                    >
                      Track Order
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
};

export default YourOrdersScreen;
