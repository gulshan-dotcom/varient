"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useData } from "@/components/DataContext";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function PlaceOrderPage() {
  const { dbUser, reload } = useData();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const productId = searchParams.get("productId");
  const color = searchParams.get("color");
  const size = searchParams.get("size");
  const qtyParam = searchParams.get("quantity");

  const [step, setStep] = useState(1);
  const [quantity, setQuantity] = useState(qtyParam ? parseInt(qtyParam) : 1);
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

  const [product, setProduct] = useState({});

  useEffect(() => {
    const findProduct = async () => {
      const res = await fetch(`/api/user/products/${productId}`);
      const data = await res.json();
      setProduct(data);
    };
    try {
      findProduct();
    } catch (error) {
      toast.error("can not find that product");
      console.log(error);
    }
  }, []);

  const isFirstOrder = dbUser?.Orders?.length === 0;
  const discount = Math.round(
    product.currentPrice * quantity * (isFirstOrder ? 0.15 : 0.1)
  );
  const total = product.currentPrice * quantity - discount;

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      console.log(
        `/user/login?redirect=${encodeURIComponent(
          `${pathname}/?productId=${productId}&color=${color}&size=${size}&quantity=${quantity}`
        )}`,
        " pathname in placeorder"
      );
      router.push(
        `/user/login?redirect=${encodeURIComponent(
          `${pathname}/?productId=${productId}&color=${color}&size=${size}&quantity=${quantity}`
        )}`
      );
      toast.info("Please log in to place an order");
      return;
    }
  }, [session, status, router, pathname]);

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

  const handleQuantity = (delta) =>
    setQuantity((prev) => Math.max(1, prev + delta));

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
      toast.error("Enter valid 10-digit phone");
      return false;
    }
    if (!/^\d{6}$/.test(address.pincode)) {
      toast.error("Enter valid 6-digit PIN");
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

  const placeOrder = async () => {
    const res = await fetch("/api/user/order/place", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        size,
        color,
        address: { ...address, country: "India" },
        wasExchanged: null,
      }),
    });
    if (!res.ok) throw new Error("Order failed");
  };

  const handlePayment = async () => {
    if (!validateAddress()) return;

    try {
      const orderRes = await fetch("/api/payment/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": session.user.email,
        },
        body: JSON.stringify({ amount: product.currentPrice * quantity }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: "INR",
        name: "FsWorld",
        description: `Order for ${product.title}`,
        order_id: orderData.orderId,
        prefill: { name: address.fullName, contact: address.phone },
        theme: { color: "#52b395" },
        handler: async function (response) {
          try {
            await updateUserAddress();
            const promises = Array(quantity)
              .fill(null)
              .map(() => placeOrder());
            await Promise.all(promises);
            toast.success("Order placed successfully!");
            router.push("/user/orders");
          } catch (err) {
            toast.error(err.description || "Payment failed");
          }
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error(err.message || "Payment failed");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen bg-[#f8fafc] pt-6 pb-24 md:pb-6">
        <div className="max-w-3xl mx-auto px-4">
          <button
            onClick={() => (step === 1 ? router.back() : setStep(1))}
            className="flex items-center gap-2 text-[#111827] mb-6"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>

          {step === 1 && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-center mb-6 text-[#111827]">
                Order Summary
              </h2>
              <div className="flex gap-4 mb-4">
                <Image
                  src={
                    product.images?.[
                      color === "maincolor" ? "main" : color
                    ]?.[0].image || "/placeholder.jpg"
                  }
                  alt={product.title}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-[#111827]">
                    {product.title}
                  </h3>
                  <p className="text-[#4b5563]">₹{product.currentPrice}</p>
                  <div className="flex items-center gap-2 my-2">
                    <button
                      onClick={() => handleQuantity(-1)}
                      className="w-8 h-8 border rounded flex items-center justify-center"
                    >
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <span className="w-10 text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantity(1)}
                      className="w-8 h-8 border rounded flex items-center justify-center"
                    >
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="text-[#52b395] font-semibold">
                    Color: {color === "main" ? product.images.maincolor : color}
                  </p>
                  <p className="text-[#52b395] font-semibold">Size: {size}</p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-[#4b5563]">
                  <span>Subtotal</span>
                  <span>₹{product.currentPrice * quantity}</span>
                </div>
                <div className="flex justify-between text-[#4b5563]">
                  <span>Discount ({isFirstOrder ? "15%" : "10%"})</span>
                  <span>-₹{discount}</span>
                </div>
                <div className="flex justify-between text-[#4b5563]">
                  <span>Shipping</span>
                  <span className="flex items-center gap-1">
                    Free
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3"
                      />
                    </svg>
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold text-[#6d28d9]">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full mt-6 bg-[#52b395] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                Next
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-center mb-6 text-[#111827]">
                Address & Phone
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#4b5563] mb-1">
                    Full Name *
                  </label>
                  <div className="flex items-center border rounded-lg px-3">
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      className="mr-2 text-[#9ca3af]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) =>
                        setAddress({ ...address, fullName: e.target.value })
                      }
                      className="flex-1 py-3 outline-none"
                      placeholder="Enter full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4b5563] mb-1">
                    Phone Number *
                  </label>
                  <div className="flex items-center border rounded-lg px-3">
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      className="mr-2 text-[#9ca3af]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
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
                      className="flex-1 py-3 outline-none"
                      placeholder="10-digit number"
                      maxLength={10}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4b5563] mb-1">
                    PIN Code *
                  </label>
                  <div className="flex items-center border rounded-lg px-3">
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      className="mr-2 text-[#9ca3af]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
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
                      className="flex-1 py-3 outline-none"
                      placeholder="6-digit PIN"
                      maxLength={6}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#4b5563] mb-1">
                    House No., Building Name *
                  </label>
                  <div className="flex items-center border rounded-lg px-3">
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      className="mr-2 text-[#9ca3af]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <input
                      type="text"
                      value={address.houseNumber}
                      onChange={(e) =>
                        setAddress({ ...address, houseNumber: e.target.value })
                      }
                      className="flex-1 py-3 outline-none"
                      placeholder="e.g., A-101, Basant Society"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#4b5563] mb-1">
                    Street Name, Locality & Area *
                  </label>
                  <div className="flex items-center border rounded-lg px-3">
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      className="mr-2 text-[#9ca3af]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) =>
                        setAddress({ ...address, street: e.target.value })
                      }
                      className="flex-1 py-3 outline-none"
                      placeholder="e.g., Main Street, Vasant Kunj"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#4b5563] mb-1">
                    Landmark (Optional)
                  </label>
                  <div className="flex items-center border rounded-lg px-3">
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      className="mr-2 text-[#9ca3af]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      value={address.landmark}
                      onChange={(e) =>
                        setAddress({ ...address, landmark: e.target.value })
                      }
                      className="flex-1 py-3 outline-none"
                      placeholder="e.g., Near City Mall"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4b5563] mb-1">
                    City *
                  </label>
                  <div className="flex items-center border rounded-lg px-3">
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      className="mr-2 text-[#9ca3af]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H9m12 0a1 1 0 001-1v-5a1 1 0 00-1-1h-6a1 1 0 00-1 1v5a1 1 0 001 1m-3-9h.01"
                      />
                    </svg>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) =>
                        setAddress({ ...address, city: e.target.value })
                      }
                      className="flex-1 py-3 outline-none"
                      placeholder="e.g., New Delhi"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4b5563] mb-1">
                    State *
                  </label>
                  <div className="flex items-center border rounded-lg px-3">
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      className="mr-2 text-[#9ca3af]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) =>
                        setAddress({ ...address, state: e.target.value })
                      }
                      className="flex-1 py-3 outline-none"
                      placeholder="e.g., Delhi"
                    />
                  </div>
                </div>
              </div>

              <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
                <button
                  onClick={handlePayment}
                  className="w-full bg-[#52b395] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 10h22"
                    />
                  </svg>
                  Pay ₹{total}
                </button>
              </div>

              <div className="hidden md:block mt-6">
                <button
                  onClick={handlePayment}
                  className="w-full bg-[#52b395] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 10h22"
                    />
                  </svg>
                  Pay ₹{total}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
