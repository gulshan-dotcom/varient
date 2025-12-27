"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { AnimatePresence, motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "@/stylesheets/user/detail-page.css";
import { useData } from "@/components/DataContext";
import ProductCard from "@/components/ProductCard";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import DetailSkeleton from "@/components/DetailSkeleton";

const Page = () => {
  const { productId } = useParams();
  const { dbUser, reload } = useData();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentVariant, setCurrentVariant] = useState("main");
  const swiperRef = useRef(null);
  const videoRefs = useRef([]);
  const [product, setProduct] = useState({});
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);

  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);
  const [sizeQuantityModal, setSizeQuantityModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    const findProduct = async () => {
      const res = await fetch(`/api/user/products/${productId}`);
      const data = await res.json();
      setProduct(data);
      setIsLoadingProduct(false);
    };
    try {
      findProduct();
    } catch (error) {
      toast.error("can not find that product");
      console.log(error);
    }
  }, []);

  const handleSlideChange = (swiper) => {
    videoRefs.current.forEach((v) => v && v.pause());

    const activeIndex = swiper.realIndex;
    const activeMedia = currentImages[activeIndex];

    if (activeMedia?.type === "video/mp4") {
      const video = videoRefs.current[activeIndex];
      video?.play();
    }
    setSelectedImageIndex(activeIndex);
  };

  const { data: session, status } = useSession();
  const router = useRouter();

  const addToCart = async (productId, color, size) => {
    if (!session && status !== "loading") {
      router.push(
        `/user/login/?redirect=${encodeURIComponent(
          `/user/item/details/${productId}`
        )}`
      );
      toast.info("Please log in to add items to your cart", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!color || !size) {
      toast.error("Please select color and size", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    toast.success("Adding item to cart...", {
      position: "top-right",
      autoClose: 2000,
    });
    const alreadyInCart = dbUser?.cart?.some(
      (item) =>
        item.productId === productId &&
        item.size === size &&
        item.color === color
    );
    try {
      let res;
      if (alreadyInCart) {
        res = await fetch(`/api/user/cart/updateQty`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId, size, color }),
        });
      } else {
        res = await fetch(`/api/user/cart/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId, size, color }),
        });
      }

      console.log(res, "Cart response");

      const data = await res.json();
      console.log(data, "respnonsj");

      if (!res.ok) {
        toast.error("Failed to update cart", {
          position: "top-right",
          autoClose: 3000,
        });
        console.log("Cart error:", data);
      }
      reload("dbUser");
    } catch (err) {
      console.error("Cart request error:", err);
      toast.error("Something went wrong", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  const currentImages = product.images?.[currentVariant] || [];

  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    const productCategoryIds =
      product.categoryData?.map((c) => c.categoryId) || [];
    const categoryMap = Object.fromEntries(
      productCategoryIds.map((id) => [id, 4])
    );

    const fetchRecommendedProducts = async () => {
      const res = await fetch("/api/user/products/by-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryMap,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRecommendedProducts(data.data);
      }
    };
    fetchRecommendedProducts();
  }, [product]);

  const handleQuantityChange = (action) => {
    if (action === "increase" && quantity < 10) {
      setQuantity(quantity + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slideTo(index);
    }
  };

  const handleVariantChange = (variant) => {
    setCurrentVariant(variant);
    setSelectedImageIndex(0);
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slideTo(0); // Reset slider to first image
    }
  };

  const openSizeQuantityModal = (action) => {
    setPendingAction(action);
    setSizeQuantityModal(true);
  };

  const confirmAction = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (pendingAction === "cart") {
      addToCart(productId, currentVariant, selectedSize);
    }
    if (pendingAction === "buy") {
      toast.info("Processing Buy Now...", {
        position: "top-right",
        autoClose: 3000,
      });

      const query = new URLSearchParams({
        productId,
        color: currentVariant,
        size: selectedSize,
        quantity: quantity.toString(),
      }).toString();
      router.push(`/user/item/order?${query}`);
    }
    setSizeQuantityModal(false);
    setSelectedSize(null);
    setQuantity(1);
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  if (isLoadingProduct) {
    return (
      <>
        <ToastContainer />
        <motion.section className="product-details">
          <DetailSkeleton />
        </motion.section>
      </>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <motion.section
        className="product-details"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <div className="product-container">
          {/* Image Gallery */}
          <div className="product-gallery">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              loop={currentImages.length > 1}
              className="gallery-container"
              style={{ maxWidth: "100%", height: "480px" }}
              ref={swiperRef}
              onSlideChange={(swiper) => {
                handleSlideChange(swiper);
                setSelectedImageIndex(swiper.realIndex);
              }}
            >
              {currentImages.map((media, index) => {
                const isVideo = media.type === "video/mp4";
                return (
                  <SwiperSlide key={index} className="gallery-slide">
                    <div
                      className="relative flex items-center justify-center w-full h-full cursor-zoom-in"
                      onClick={() => {
                        setZoomIndex(index);
                        setZoomOpen(true);
                      }}
                    >
                      {isVideo ? (
                        <div className="video-player">
                          <video
                            src={media.image}
                            width={600}
                            ref={(el) => (videoRefs.current[index] = el)}
                            height={540}
                            className="gallery-video"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      ) : (
                        <Image
                          src={media.image}
                          alt={`${
                            product.title || "Product"
                          } - ${currentVariant} Media ${index + 1}`}
                          width={600}
                          height={540}
                          className="gallery-image"
                          style={{ objectFit: "cover" }}
                        />
                      )}
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            <div className="gallery-thumbnails">
              {currentImages.map((media, index) => {
                const isVideo = media.type === "video/mp4";
                return (
                  <div
                    key={index}
                    className={`thumbnail flex items-center justify-center ${
                      selectedImageIndex === index ? "selected" : ""
                    }`}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    {isVideo ? (
                      <div className="thumbnail-video-wrapper">
                        <video
                          src={media.image}
                          width={100}
                          height={100}
                          muted
                          className="thumbnail-video"
                          preload="metadata"
                        />
                        <div className="play-icon-overlay">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="white"
                            viewBox="0 0 24 24"
                            stroke="none"
                            width="28"
                            height="28"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <Image
                        src={media.image}
                        alt={`Thumbnail ${index + 1}`}
                        width={100}
                        height={100}
                        className="thumbnail-image"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <p className="product-brand">Varient's</p>
            <h1 className="product-title">
              {product.title || "Premium Silk Saree"}
            </h1>
            <div className="product-price">
              <span className="price-current">
                &#8377;{product.currentPrice || "5,999"}
              </span>
              <span className="price-original">
                &#8377;{product.oldPrice || "7,999"}
              </span>
            </div>

            {/* Color Variants */}
            {product.images && Object.keys(product.images).length > 1 && (
              <div className="color-variants">
                {Object.keys(product.images || {})
                  .filter((item) => item !== "maincolor")
                  .map((key) => (
                    <div
                      key={key}
                      className={`color-option ${
                        currentVariant === key ? "selected" : ""
                      }`}
                      data-color={`variant-${key}`}
                      onClick={() => handleVariantChange(key)}
                    >
                      <Image
                        src={
                          key === "maincolor"
                            ? product.images.main[0].image
                            : product.images[key][0].image
                        }
                        alt={`Variant ${key}`}
                        width={80}
                        height={80}
                        className="color-option-image"
                      />
                      <div className="color-optionLabel text-center text-sm my-2.5">
                        {key !== "main"
                          ? key
                          : product.images.maincolor || "Main Color Name"}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Product Description */}
            <div className="product-description">
              <h1 className="desc-heading">Description</h1>
              <div
                className="dynamic-desc"
                dangerouslySetInnerHTML={{
                  __html: product.description || "No description available.",
                }}
              />
            </div>
            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                className="add-to-cart"
                onClick={() => openSizeQuantityModal("cart")}
                data-action="add-to-cart"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Add to Cart
              </button>
              <button
                onClick={() => openSizeQuantityModal("buy")}
                className="buy-now"
                data-action="buy-now"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Buy Now
              </button>
              <button
                className="share-btn"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "FsWorld Product",
                      text: "Check this out!",
                      url: window.location.href,
                    });
                  } else {
                    toast.error("Please select color and size", {
                      position: "top-right",
                      autoClose: 3000,
                    });
                  }
                }}
                data-share="toggle"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Product Recommendations */}
        <motion.section
          className="product-recommendations"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <h2>You May Also Like</h2>
          <div className="recommendations-grid">
            {recommendedProducts.map((rec) => (
              <ProductCard key={rec._id} product={rec} showUserActions={true} />
            ))}
          </div>
        </motion.section>
      </motion.section>
      <AnimatePresence>
        {zoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="zoom-panel fixed inset-0 z-[9999] bg-black"
          >
            {/* Close */}
            <div
              className="zoom-close absolute top-[100px] right-4 text-white text-3xl cursor-pointer z-50"
              onClick={() => setZoomOpen(false)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokewdth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M16 8L8 16M12 12L16 16M8 8L10 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="#dadadaff"
                    strokedth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </g>
              </svg>
            </div>

            {/* Swipable fullscreen */}
            <Swiper
              initialSlide={zoomIndex}
              slidesPerView={1}
              spaceBetween={0}
              className="w-full h-full mt-[50px]"
            >
              {currentImages.map((media, i) => (
                <SwiperSlide
                  key={i}
                  className="fulscreen-slide flex items-center justify-center"
                >
                  {media.type === "video/mp4" ? (
                    <video
                      src={media.image}
                      autoPlay
                      muted
                      loop
                      playsInline
                      controls
                      className="max-w-full max-h-full"
                    />
                  ) : (
                    <TransformWrapper
                      initialScale={1}
                      minScale={1}
                      maxScale={4}
                      wheel={{ step: 0.2 }}
                      pinch={{ step: 5 }}
                      doubleClick={{ mode: "zoomIn" }}
                      className="w-full h-full"
                    >
                      <TransformComponent>
                        <Image
                          src={media.image}
                          alt="Zoomed"
                          width={1200}
                          height={1200}
                          className="max-w-full max-h-full object-contain"
                        />
                      </TransformComponent>
                    </TransformWrapper>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sizeQuantityModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="size-quantity-modal fixed inset-0 z-90"
            onClick={() => setSizeQuantityModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="size-quantity-sheet"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Current Variant Preview Image */}
              {currentImages && (
                <Image
                  src={currentImages[0].image}
                  height={300}
                  width={300}
                  alt="Selected variant"
                  className="variant-preview-img"
                />
              )}

              <h2 className="text-xl font-bold text-center mb-4">
                {product.title}
              </h2>

              {/* Size Selector */}
              <div className="size-selector mb-6">
                <label className="block textLg font-medium mb-3">
                  Select Size
                </label>
                <div className="size-options">
                  {["S", "M", "L", "XL"].map((size) => (
                    <button
                      key={size}
                      className={`size-option ${
                        selectedSize === size ? "selected" : ""
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="quantity-selector mb-8">
                <label className="block textLg font-medium mb-3">
                  Quantity
                </label>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <input
                    className="quantity-input"
                    type="text"
                    value={quantity}
                    readOnly
                  />
                  <button
                    className="quantity-btn"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="size-quantity-actions">
                <button
                  className="bg-gray-300 text-black"
                  onClick={() => setSizeQuantityModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white"
                  onClick={confirmAction}
                >
                  {pendingAction === "cart" ? "Add to Cart" : "Continue"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Page;
