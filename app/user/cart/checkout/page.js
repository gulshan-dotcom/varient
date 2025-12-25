"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useData } from "@/components/DataContext";
import { toast, ToastContainer } from "react-toastify";

export default function CartCheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { dbUser, reload } = useData();
  const [products, setProducts] = useState([]);

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

  const [address, setAddress] = useState({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    houseNumber: "",
  });

  // Calculate cart total
  const netPrice =
    dbUser?.cart?.reduce((total, cartItem) => {
      const product = products.find((p) => p._id === cartItem.productId);
      return total + (product?.currentPrice || 0) * cartItem.quantity;
    }, 0) || 0;

  const isFirstOrder = (dbUser?.Orders?.length || 0) === 0;
  const discount = Math.round(netPrice * (isFirstOrder ? 0.15 : 0.1));
  const total = netPrice - discount;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push(
        `/user/login?redirect=${encodeURIComponent("/user/cart/checkout")}`
      );
      toast.info("Please log in to place your order");
    }
  }, [session, status, router]);

  // Pre-fill address from dbUser
  useEffect(() => {
    if (dbUser) {
      setAddress({
        fullName: dbUser.username || "",
        email: dbUser.email || "",
        phone: dbUser.phone || "",
        street: dbUser.address?.street || "",
        city: dbUser.address?.city || "",
        state: dbUser.address?.state || "",
        pincode: dbUser.address?.pincode || "",
        landmark: dbUser.address?.landmark || "",
        houseNumber: dbUser.address?.houseNumber || "",
      });
    }
  }, [dbUser]);

  const validateAddress = () => {
    const required = [
      "fullName",
      "phone",
      "street",
      "city",
      "state",
      "pincode",
      "houseNumber",
    ];
    const missing = required.filter((f) => !address[f]?.trim());

    if (missing.length > 0) {
      toast.error(`Please fill: ${missing.join(", ")}`);
      return false;
    }
    if (!/^\d{10}$/.test(address.phone)) {
      toast.error("Enter a valid 10-digit phone number");
      return false;
    }
    if (!/^\d{6}$/.test(address.pincode)) {
      toast.error("Enter a valid 6-digit PIN code");
      return false;
    }
    return true;
  };

  const updateUserAddress = async () => {
    const res = await fetch("/api/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: { ...address, country: "India" } }),
    });
    if (!res.ok) throw new Error("Failed to update address");
    reload("dbUser");
  };

  const placeCartOrder = async () => {
    const res = await fetch("/api/user/order/place/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}), // affilatorId handled via cookies or backend logic
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to place order");
    }
    return res.json();
  };

  const initiatePayment = async () => {
    const res = await fetch("/api/payment/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-email": session?.user?.email || "",
      },
      body: JSON.stringify({ amount: total }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Payment initiation failed");
    return data;
  };

  const handlePayNow = async () => {
    if (!validateAddress()) return;

    try {
      const { key, amount, orderId } = await initiatePayment();

      const options = {
        key,
        amount,
        currency: "INR",
        name: "FsWorld",
        description: "Cart Order Payment",
        image:
          "https://rzz1bwkago.ufs.sh/f/OPkkuA3bVahinICwt2L8y0BXqVuhxf47TitO2U3RgNpnQe9b",
        order_id: orderId,
        prefill: {
          name: address.fullName,
          contact: address.phone,
        },
        theme: { color: "#52b395" },
        handler: async (response) => {
          try {
            await updateUserAddress();
            await placeCartOrder();

            toast.success(
              `Order placed successfully! Payment ID: ${response.razorpay_payment_id}`
            );
            router.push("/user/orders");
          } catch (err) {
            toast.error(err.message || "Order failed after payment");
          }
        },
      };

      // @ts-ignore - Razorpay is loaded globally
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error(err.message || "Payment failed");
    }
  };

  if (status === "loading" || !session) return null;

  return (
    <>
      <ToastContainer position="top-right" autoClose={4000} />

      <div className="min-h-screen bg-[#f8fafc] py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-800 mb-6 hover:text-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>

          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8 font-['Cinzel']">
            Address & Phone
          </h1>

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            {/* Address Form */}
            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Full Name *
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3">
                  <svg
                    className="w-5 h-5 text-gray-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) =>
                      setAddress({ ...address, fullName: e.target.value })
                    }
                    className="flex-1 outline-none text-gray-800"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Phone Number *
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3">
                  <svg
                    className="w-5 h-5 text-gray-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <input
                    type="tel"
                    value={address.phone}
                    onChange={(e) =>
                      setAddress({
                        ...address,
                        phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                      })
                    }
                    className="flex-1 outline-none text-gray-800"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                </div>
              </div>

              {/* House No. & Street */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  House No., Building Name *
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3">
                  <svg
                    className="w-5 h-5 text-gray-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <input
                    type="text"
                    value={address.houseNumber}
                    onChange={(e) =>
                      setAddress({ ...address, houseNumber: e.target.value })
                    }
                    className="flex-1 outline-none"
                    placeholder="e.g., Flat 101, Sunshine Apartments"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Street, Area, Colony *
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3">
                  <svg
                    className="w-5 h-5 text-gray-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) =>
                      setAddress({ ...address, street: e.target.value })
                    }
                    className="flex-1 outline-none"
                    placeholder="e.g., MG Road, Sector 14"
                  />
                </div>
              </div>

              {/* Landmark (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Landmark (Optional)
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3">
                  <svg
                    className="w-5 h-5 text-gray-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <circle cx="12" cy="11" r="3" strokeWidth={2} />
                  </svg>
                  <input
                    type="text"
                    value={address.landmark}
                    onChange={(e) =>
                      setAddress({ ...address, landmark: e.target.value })
                    }
                    className="flex-1 outline-none"
                    placeholder="e.g., Near Metro Station"
                  />
                </div>
              </div>

              {/* City & State */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    City *
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3">
                    <svg
                      className="w-5 h-5 text-gray-400 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H9m12 0a1 1 0 001-1v-5a1 1 0 00-1-1h-6a1 1 0 00-1 1v5a1 1 0 001 1m-3-9h.01"
                      />
                    </svg>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) =>
                        setAddress({ ...address, city: e.target.value })
                      }
                      className="flex-1 outline-none"
                      placeholder="New Delhi"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    State *
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3">
                    <svg
                      className="w-5 h-5 text-gray-400 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) =>
                        setAddress({ ...address, state: e.target.value })
                      }
                      className="flex-1 outline-none"
                      placeholder="Delhi"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    PIN Code *
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3">
                    <svg
                      className="w-5 h-5 text-gray-400 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <circle cx="12" cy="11" r="3" strokeWidth={2} />
                    </svg>
                    <input
                      type="text"
                      value={address.pincode}
                      onChange={(e) =>
                        setAddress({
                          ...address,
                          pincode: e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6),
                        })
                      }
                      className="flex-1 outline-none"
                      placeholder="110001"
                      maxLength={6}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Total Summary */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="space-y-2 text-lg">
                <div className="flex justify-between text-gray-600">
                  <span>Net Price</span>
                  <span>₹{netPrice}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Discount ({isFirstOrder ? "15%" : "10%"})</span>
                  <span className="text-green-600">-₹{discount}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-[#52b395]">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <div className="mt-8">
              <button
                onClick={handlePayNow}
                className="w-full bg-[#52b395] hover:bg-[#5AB9CC] text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-3 transition shadow-lg"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect
                    x="1"
                    y="4"
                    width="22"
                    height="16"
                    rx="2"
                    ry="2"
                    strokeWidth={2}
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M1 10h22"
                  />
                </svg>
                Pay Now ₹{total}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Fixed Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-xl md:hidden">
          <button
            onClick={handlePayNow}
            className="w-full bg-[#52b395] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3"
          >
            Pay ₹{total}
          </button>
        </div>
      </div>
    </>
  );
}
