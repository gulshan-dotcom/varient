// app/user/orders/exchange/[orderId]/page.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function ExchangePage() {
  const { orderId } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [currentVariant, setCurrentVariant] = useState("main");
  const swiperRef = useRef(null);
  const videoRefs = useRef([]);
  const [isPlaying, setIsPlaying] = useState({});
  const [product, setProduct] = useState({});

  // Fetch order details on mount
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        setLoading(true);
        const res = await fetch("/api/user/order/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(result.error || "Failed to load order");
        }

        const fetchedOrder = result.order;
        setOrder(fetchedOrder);

        // Extract product ID from the first item
        const productId = fetchedOrder.items[0]?.product;
        if (!productId) {
          toast.error("Product not found in order");
          return;
        }
        const productRes = await fetch(`/api/user/products/${productId}`);
        const foundProduct = await productRes.json();
        setProduct(foundProduct);

        // Auto-select current color & size from old order
        const oldItem = fetchedOrder.items[0];
        setSelectedColor(oldItem.color || Object.keys(fullProduct.images)[0]);
        setSelectedSize(oldItem.size);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchOrder();
    } else if (status === "unauthenticated") {
      router.replace(`/login?redirect=/user/orders/exchange/${orderId}`);
    }
  }, [orderId, status, router]);

  useEffect(() => {
    if (order) {
      if (order.statusCode !== 4 || order.wasExchanged.status) {
        router.replace(`/user/orders/track/${orderId}`);
      }
    }
  }, [order]);

  const sizes = product?.sizes || [];
  const currentImages = product?.images?.[currentVariant] || [];

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleDone = async () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please select both color and size");
      return;
    }

    console.log({
      oldOrderId: orderId,
      newColor: selectedColor,
      newSize: selectedSize,
    });

    try {
      const res = await fetch("/api/user/order/exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldOrderId: orderId,
          newColor: selectedColor,
          newSize: selectedSize,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Exchange failed");
      }

      toast.success("Exchange request submitted successfully!");
      setTimeout(() => {
        router.push(`/user/orders/track/${orderId}`);
      }, 2000);
    } catch (err) {
      console.error("Exchange error:", err);
      toast.error(err.message || "Something went wrong");
    }
  };

  const handlePlayPause = (index) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (video.paused) {
      videoRefs.current.forEach((v, i) => {
        if (v && i !== index) v.pause();
      });
      video.play();
      setIsPlaying((p) => ({ ...p, [index]: true }));
    } else {
      video.pause();
      setIsPlaying((p) => ({ ...p, [index]: false }));
    }
  };

  const handleSlideChange = () => {
    videoRefs.current.forEach((video, index) => {
      if (video && !video.paused) {
        video.pause();
        setIsPlaying((p) => ({ ...p, [index]: false }));
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9fbfd] flex items-center justify-center">
        <p className="text-gray-600">Loading exchange details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f9fbfd] flex items-center justify-center">
        <p className="text-red-500">Product not found</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-center" theme="light" />

      <div className="min-h-screen bg-[#f9fbfd] pb-24">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center px-4 pt-6 pb-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="w-6 h-6 text-[#0d1527]" />
            </button>
            <h1 className="flex-1 text-center text-xl font-bold text-[#0d1527] -ml-10">
              Exchange Product
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="px-4 space-y-8"
          >
            {/* Product Title */}
            <div className="text-center">
              <h2 className="text-lg font-semibold text-[#0d1527]">
                {product.title}
              </h2>
            </div>

            {/* Image Gallery */}
            <div className="space-y-4">
              {currentImages.length > 0 ? (
                <>
                  <div className="rounded-xl overflow-hidden bg-white shadow-sm">
                    <Swiper
                      modules={[Pagination]}
                      pagination={{ clickable: true }}
                      loop={currentImages.length > 1}
                      ref={swiperRef}
                      className="h-96 rounded-xl overflow-hidden"
                      onSlideChange={(swiper) => {
                        handleSlideChange();
                      }}
                    >
                      {currentImages.map((media, index) => {
                        const isVideo = media.type === "video/mp4";

                        return (
                          <SwiperSlide key={index}>
                            <div className="relative w-full h-full bg-black">
                              {isVideo ? (
                                <>
                                  <video
                                    ref={videoRefs}
                                    src={media.image}
                                    className="w-full h-full object-cover"
                                  />
                                  <div
                                    onClick={() => handlePlayPause(index)}
                                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                                  >
                                    {!isPlaying[index] ? (
                                      <svg
                                        height="40px"
                                        width="40px"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <g
                                          id="SVGRepo_bgCarrier"
                                          strokeWidth="0"
                                        ></g>
                                        <g
                                          id="SVGRepo_tracerCarrier"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        ></g>
                                        <g id="SVGRepo_iconCarrier">
                                          <path
                                            d="M21.4086 9.35258C23.5305 10.5065 23.5305 13.4935 21.4086 14.6474L8.59662 21.6145C6.53435 22.736 4 21.2763 4 18.9671L4 5.0329C4 2.72368 6.53435 1.26402 8.59661 2.38548L21.4086 9.35258Z"
                                            fill="#454549"
                                          ></path>
                                        </g>
                                      </svg>
                                    ) : (
                                      <svg
                                        width="40px"
                                        height="40px"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <g
                                          id="SVGRepo_bgCarrier"
                                          strokeWidth="0"
                                        ></g>
                                        <g
                                          id="SVGRepo_tracerCarrier"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        ></g>
                                        <g id="SVGRepo_iconCarrier">
                                          <path
                                            d="M2 6C2 4.11438 2 3.17157 2.58579 2.58579C3.17157 2 4.11438 2 6 2C7.88562 2 8.82843 2 9.41421 2.58579C10 3.17157 10 4.11438 10 6V18C10 19.8856 10 20.8284 9.41421 21.4142C8.82843 22 7.88562 22 6 22C4.11438 22 3.17157 22 2.58579 21.4142C2 20.8284 2 19.8856 2 18V6Z"
                                            fill="#454549"
                                          ></path>
                                          <path
                                            d="M14 6C14 4.11438 14 3.17157 14.5858 2.58579C15.1716 2 16.1144 2 18 2C19.8856 2 20.8284 2 21.4142 2.58579C22 3.17157 22 4.11438 22 6V18C22 19.8856 22 20.8284 21.4142 21.4142C20.8284 22 19.8856 22 18 22C16.1144 22 15.1716 22 14.5858 21.4142C14 20.8284 14 19.8856 14 18V6Z"
                                            fill="#454549"
                                          ></path>
                                        </g>
                                      </svg>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <Image
                                  src={media.image}
                                  alt="Product media"
                                  fill
                                  className="object-cover"
                                  priority
                                />
                              )}
                            </div>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </div>

                  {/* Thumbnails */}
                  <div className="flex gap-4 flex-wrap">
                    {Object.keys(product.images || {})
                      .filter((k) => k !== "maincolor")
                      .map((variant) => (
                        <div
                          key={variant}
                          className="text-center flex flex-col"
                        >
                          <button
                            onClick={() => {
                              setCurrentVariant(variant);
                              handleColorChange(variant);
                              swiperRef.current?.swiper?.slideTo(0);
                            }}
                            className={`w-20 h-20 rounded-lg border-2 ${
                              currentVariant === variant
                                ? "border-[#52b395]"
                                : "border-gray-200"
                            }`}
                          >
                            <Image
                              src={product.images[variant][0].image}
                              alt={variant}
                              width={80}
                              height={80}
                              className="object-cover"
                            />
                          </button>
                          <div className="text-center text-sm mt-1 text-gray-600">
                            {variant}
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              ) : (
                <div className="h-96 bg-gray-100 rounded-xl flex items-center justify-center">
                  <p className="text-gray-500">No images</p>
                </div>
              )}
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#374151]">
                Select Size
              </h3>
              <div className="flex gap-3 flex-wrap">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-3 rounded-lg font-medium transition-all ${
                      selectedSize === size
                        ? "bg-[#52b395] text-white shadow-md"
                        : "bg-white border border-[#e5e7eb] text-[#374151] hover:border-[#52b395]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Done Button */}
            <button
              onClick={handleDone}
              className="w-full bg-[#52b395] text-white py-4 rounded-xl font-semibold text-lg uppercase tracking-wider shadow-lg hover:bg-[#5ab8d3] transition-all active:scale-95"
            >
              Submit Exchange
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
}
