"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Copy, MessageCircle, Mail, Phone, RefreshCcw } from "lucide-react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";
import { useData } from "@/components/DataContext";
import "react-toastify/dist/ReactToastify.css";
import { AnimatePresence, motion } from "framer-motion";

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const { status } = useSession();
  const { products } = useData();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/user/order/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();
      if (!data.success) throw new Error("Failed to load order");

      // const data = JSON.parse(`{
      //   "success": true,
      //   "code": 3,
      //   "label": "In Transit",
      //   "current_status": "Picked Up by Courier",
      //   "isReturnFlow": false,
      //   "isRTO": false,
      //   "order": {
      //     "_id": "671d20f9b761c91be090eb1a",
      //     "user": "671c9c38cefeaad769901b89",
      //     "items": [
      //       {
      //         "product": "6890a984c94ca39f198e6c02",
      //         "color": "main",
      //         "size": "L",
      //         "priceAtPurchase": 424.15
      //       }
      //     ],
      //     "totalAmount": 999,
      //     "vendorPrice": 450,
      //     "OrderId": "TS123456",
      //     "chanelOrderId": "987654321",
      //     "shipmentId": "123456789",
      //     "trackingCode": "AWB99887766",
      //     "courierBy": "Delhivery",
      //     "address": {
      //       "houseNumber": "21A",
      //       "street": "Green Park",
      //       "landmark": "Central Mall",
      //       "city": "Delhi",
      //       "state": "Delhi",
      //       "country": "india",
      //       "pincode": "110016"
      //     },
      //     "affilator": null,
      //     "status": "inTransit",
      //     "statusCode": 3,
      //     "cancelled": {
      //       "status": false,
      //       "time": null
      //     },
      //     "wasExchanged": {
      //       "status": false,
      //       "forProduct": null
      //     },
      //     "exchanged": {
      //       "status": "none",
      //       "forProduct": null
      //     },
      //     "returnInfo": {
      //       "shipmentId": null,
      //       "orderId": null,
      //       "awbCode": null,
      //       "courierName": null,
      //       "createdAt": "2025-02-17T10:35:42.204Z"
      //     },
      //     "isRTO": false,
      //     "purchasedAt": "2025-02-17T10:35:42.204Z",
      //     "createdAt": "2025-02-17T10:35:42.205Z",
      //     "updatedAt": "2025-02-17T12:10:31.175Z",
      //     "__v": 1
      //   },
      //   "trakingInfo": {
      //     "edd": "12 Feb 2025",
      //     "returnPickupDate": null,
      //     "pickupDate": "05 Feb 2025",
      //     "confirmationDate": "03 Feb 2025",
      //     "trackigUrl": "https://shiprocket.co/tracking/AWB99887766"
      //   }
      // }
      // `);

      setOrderData(data);
    } catch (err) {
      toast.error("Failed to load order tracking");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/login?redirect=/user/orders/track/${orderId}`);
    }
    if (status === "authenticated" && orderId) fetchOrder();
  }, [status, orderId, fetchOrder]);

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  const contacts = [
    {
      label: "WhatsApp",
      value: "9162843443",
      icon: <MessageCircle size={18} />,
    },
    {
      label: "Call",
      value: "9162843443",
      icon: <Phone size={18} />,
    },
    {
      label: "Email",
      value: "support@loveden.com",
      icon: <Mail size={18} />,
    },
  ];

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  if (!orderData)
    return <p className="text-center text-red-500 mt-10">Order not found</p>;

  function isoToReadable(isoString) {
    const d = new Date(isoString);
    if (isNaN(d)) return null;

    const day = d.getUTCDate().toString().padStart(2, "0");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[d.getUTCMonth()];
    const year = d.getUTCFullYear();

    const hh = d.getUTCHours().toString().padStart(2, "0");
    const mm = d.getUTCMinutes().toString().padStart(2, "0");
    const ss = d.getUTCSeconds().toString().padStart(2, "0");

    return `${day} ${month} ${year} ${hh}:${mm}:${ss}`;
  }

  const { order, code, label, normalized, trakingInfo, isReturnFlow } =
    orderData;
  const product = products?.find((p) => p._id === order.items[0].product);

  const timeline = [
    {
      title: "Order Created",
      date: isoToReadable(order.createdAt),
      description:
        "Your product has been successfully ordered. We have received your request and our team has started processing it.",
      active: code >= 1,
    },
    {
      title: "Packed",
      date: trakingInfo.confirmationDate,
      description:
        "Your order has been packed securely. Our team has prepared it for dispatch.",
      active: code >= 2,
    },
    {
      title: "Shipped",
      date: trakingInfo.pickupDate,
      description:
        "Your package has left our warehouse and is on the way to your nearest shipping hub.",
      active: code >= 3,
    },
    {
      title: "Delivered",
      date: trakingInfo.edd,
      description:
        "Your product has been successfully delivered. We hope you enjoy your purchase!",
      active: code >= 4,
    },
  ];

  const ReturnTimeline = [
    {
      title: "Return Created",
      date: isoToReadable(order.returnInfo.createdAt),
      description:
        "Your product has been successfully initialized for return. Our team has started processing it.",
      active: code >= 5,
    },
    {
      title: "Returned by Customer",
      date: trakingInfo.returnPickupDate,
      description:
        "Your order will be Returned securely by you. We will verify the item after Recieving.",
      active: code >= 6,
    },
    {
      title: "Receiving at Warehouse",
      date: trakingInfo.rtoDeliveryDate,
      description:
        "We will receive your returned item, and your refund will be initiated.",
      active: code >= 7,
    },
  ];

  const isWithin24Hours = (orderDate) => {
    if (!orderDate) return false;

    const orderTime = new Date(orderDate).getTime();
    const currentTime = Date.now();

    const diffInHours = (currentTime - orderTime) / (1000 * 60 * 60);
    console.log(currentTime, orderTime, diffInHours);

    return diffInHours <= 4888;
  };

  console.log(product, order.items[0].product, products);

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-50 min-h-screen">
      <ToastContainer />

      {/* Order Header */}
      <h2 className="text-xl font-semibold mb-4">Order #{order.OrderId}</h2>

      {/* Product Card */}
      <div className="border rounded-lg p-4 bg-white mb-4 shadow-sm">
        <div className="flex gap-4">
          <Image
            src={
              product?.images?.[
                order.items[0].color === "maincolor"
                  ? "main"
                  : order.items[0].color
              ][0].image || "/placeholder.png"
            }
            width={80}
            height={80}
            className="rounded-md bg-gray-200"
            alt="product"
          />

          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{product?.title}</h3>
            <p className="text-xs text-gray-500">Size: {order.items[0].size}</p>
            <p className="text-xs text-gray-500">
              Color: {order.items[0].color}
            </p>
            <p className="text-sm font-bold text-teal-500 mt-1">
              ₹{order.totalAmount}
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-gray-600">Status:</span>
          <span className="text-xs px-3 py-1 font-semibold rounded bg-gray-100">
            {label}
          </span>
        </div>
      </div>

      {/* Status Tracker (Forward Flow) */}
      {!isReturnFlow && (
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">
            Delivery Progress
          </h3>

          <div className="relative flex items-start justify-between">
            {["Created", "Confirmed", "In Transit", "Delivered"].map(
              (step, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center flex-1 relative z-10"
                >
                  {/* Connecting line */}
                  {i < 3 && (
                    <div className="absolute top-1.5 left-1/2 w-full h-1 -z-10">
                      <div className="w-full h-full bg-gray-300 relative overflow-hidden rounded-full">
                        <motion.div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-green-400"
                          initial={{ width: "0%" }}
                          animate={{
                            width:
                              i + 1 < code
                                ? "100%"
                                : i + 1 === code
                                ? "50%"
                                : "0%",
                          }}
                          transition={{
                            duration: 0.8,
                            delay: i * 0.3,
                            ease: "easeInOut",
                          }}
                        ></motion.div>
                      </div>
                    </div>
                  )}
                  <motion.div
                    className={`w-4 h-4 rounded-full mb-1 ${
                      i + 1 <= code
                        ? "bg-green-500 shadow-lg shadow-green-500/50"
                        : "bg-gray-300"
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.3,
                      ease: "easeOut",
                    }}
                  ></motion.div>
                  <p className="text-[10px] text-gray-500 text-center">
                    {step}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Tracking Timeline (Forward) */}
      {!isReturnFlow && (
        <div className="border p-4 rounded-lg bg-white mb-4">
          <h3 className="font-semibold text-gray-800 mb-3">Tracking Updates</h3>
          {timeline.map((t, i) => (
            <div
              key={i}
              className="border rounded p-3 mb-2 bg-gray-100 flex gap-3"
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  t.active ? "bg-green-500" : "bg-gray-500"
                } mt-1`}
              ></div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{t.title}</p>
                <p className="text-xs text-gray-600">{t.date}</p>
                <p className="text-xs text-gray-500">{t.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RETURN TRACKING SECTION */}
      {isReturnFlow && (
        <div className="border p-4 rounded-lg bg-white mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Return Progress</h3>

          <div className="flex items-center justify-between mb-4">
            {["Return Initiated", "Return In Transit", "Return Delivered"].map(
              (step, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center flex-1 relative z-10"
                >
                  {/* Connecting line */}
                  {i < 2 && (
                    <div className="absolute top-1.5 left-1/2 w-full h-1 -z-10">
                      <div className="w-full h-full bg-gray-300 relative overflow-hidden rounded-full">
                        <motion.div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-green-400"
                          initial={{ width: "0%" }}
                          animate={{
                            width:
                              i + 5 < code
                                ? "100%"
                                : i + 5 === code
                                ? "50%"
                                : "0%",
                          }}
                          transition={{
                            duration: 0.8,
                            delay: i * 0.3,
                            ease: "easeInOut",
                          }}
                        ></motion.div>
                      </div>
                    </div>
                  )}
                  <motion.div
                    className={`w-4 h-4 rounded-full mb-1 ${
                      i + 4 < code
                        ? "bg-green-500 shadow-lg shadow-green-500/50"
                        : "bg-gray-300"
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.3,
                      ease: "easeOut",
                    }}
                  ></motion.div>
                  <p className="text-[10px] text-gray-500 text-center">
                    {step}
                  </p>
                </div>
              )
            )}
          </div>

          {/* Return Tracking Timeline */}
          {isReturnFlow && (
            <div className="border p-4 rounded-lg bg-white mb-4">
              <h3 className="font-semibold text-gray-800 mb-3">
                Return Tracking Updates
              </h3>
              {ReturnTimeline.map((t, i) => (
                <div
                  key={i}
                  className="border rounded p-3 mb-2 bg-gray-100 flex gap-3"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      t.active ? "bg-green-500" : "bg-gray-500"
                    } mt-1`}
                  ></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {t.title}
                    </p>
                    <p className="text-xs text-gray-600">{t.date}</p>
                    <p className="text-xs text-gray-500">{t.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tracking Info */}
      <div className="border rounded-lg bg-white mb-4 overflow-hidden">
        <h3 className="font-semibold text-gray-800 px-4 py-3 border-b bg-gray-50">
          Tracking Info
        </h3>

        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-2 text-gray-500 font-medium">
                Courier Company
              </td>
              <td className="px-4 py-2 text-gray-800">
                {order.courierBy || "N/A"}
              </td>
            </tr>

            <tr className="border-b bg-gray-50">
              <td className="px-4 py-2 text-gray-500 font-medium">
                Tracking ID
              </td>
              <td className="px-4 py-2 text-gray-800">
                {order.trackingCode || "N/A"}
              </td>
            </tr>

            <tr>
              <td className="px-4 py-2 text-gray-500 font-medium">
                Est. Delivery Date
              </td>
              <td className="px-4 py-2 text-gray-800">
                {trakingInfo.edd || "--"}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="px-4 py-3 border-t bg-gray-50">
          <Link
            href={trakingInfo.trackigUrl}
            className="text-teal-600 text-xs font-medium hover:underline"
            target="_blank"
          >
            Track online →
          </Link>
        </div>
      </div>

      {/* Delivery Details */}
      <div className="border p-4 rounded-lg bg-white mb-4">
        <h3 className="font-semibold text-gray-800 mb-2">Delivery Details</h3>
        <p className="text-xs text-gray-600">
          {order.address.houseNumber}, {order.address.street}
        </p>
        <p className="text-xs text-gray-600">
          {order.address.city}, {order.address.state}
        </p>
        <p className="text-xs text-gray-600">{order.address.pincode}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        <button
          className="flex-1 border border-teal-500 py-2 rounded text-xs font-semibold"
          onClick={() => setModalVisible(true)}
        >
          <MessageCircle size={14} className="inline mr-1" /> Contact Support
        </button>
        {!isReturnFlow &&
          code <= 4 &&
          isWithin24Hours(trakingInfo?.edd) &&
          !order.wasExchanged.status && (
            <button className="flex-1 border border-teal-500 py-2 rounded">
              <Link
                href={`/user/orders/exchange/${orderId}`}
                className="text-xs font-semibold"
              >
                <RefreshCcw size={14} className="inline mr-1" /> Exchange
              </Link>
            </button>
          )}
        {console.log(
          !isReturnFlow,
          code <= 4,
          isWithin24Hours(trakingInfo?.edd),
          !order.wasExchanged.status
        )}
      </div>

      <AnimatePresence>
        {modalVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end justify-center z-50"
            onClick={() => setModalVisible(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[600px] bg-white rounded-t-2xl p-5 border border-neutral-700 shadow-lg"
            >
              <h2 className="text-center text-lg font-semibold mb-5">
                Contact Support
              </h2>

              {contacts.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between mb-4 py-2"
                >
                  <div className="flex items-center gap-3">
                    {c.icon}
                    <span className="text-sm opacity-80">{c.label}</span>
                    <span className="text-sm opacity-80">{c.value}</span>
                  </div>

                  <button
                    onClick={() => copy(c.value)}
                    className="p-2 border rounded-md hover:bg-neutral-100"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              ))}

              <button
                onClick={() => setModalVisible(false)}
                className="w-full mt-4 bg-cyan-500 text-white font-semibold py-2 rounded-lg"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
