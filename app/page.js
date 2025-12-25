"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "@/stylesheets/user/home.css";
import { useData } from "@/components/DataContext";
import ProductCard from "@/components/ProductCard";
import { ToastContainer } from "react-toastify";

const HomePage = () => {
  const { categories, banners, isLoading } = useData();
  const [feed, setFeed] = useState(null);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);

  useEffect(() => {
    const getFeed = async () => {
      setIsLoadingFeed(true);
      const res = await fetch("/api/user/products/feed", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      console.log(data, " feed data");
      setFeed(data);
      setIsLoadingFeed(false);
    };
    getFeed();
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // Skeleton Components
  const BannerSkeleton = () => (
    <div className="container">
      <div className="skeleton skeleton-banner"></div>
    </div>
  );

  const CategorySkeleton = () => (
    <>
      {[...Array(8)].map((_, i) => (
        <div key={i} className="skeleton skeleton-category-card">
          <div className="skeleton skeleton-category-image"></div>
          <div className="skeleton skeleton-category-title"></div>
        </div>
      ))}
    </>
  );

  const ProductSkeleton = () => (
    <>
      {[...Array(8)].map((_, i) => (
        <div key={i} className="skeleton skeleton-product-card">
          <div className="skeleton skeleton-product-image"></div>
          <div className="skeleton-product-lines">
            <div className="skeleton skeleton-line-short"></div>
            <div className="skeleton skeleton-line-medium"></div>
            <div className="skeleton skeleton-line-long"></div>
            <div className="skeleton skeleton-button"></div>
          </div>
        </div>
      ))}
    </>
  );

  return (
    <>
      <ToastContainer />

      {/* Banner Slider */}
      <motion.section
        className="banner"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container">
          {isLoading?.banners || banners.length === 0 ? (
            <BannerSkeleton />
          ) : (
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              className="banner-slider"
            >
              {banners.map((banner) => (
                <SwiperSlide className="slide" key={banner.id}>
                  <Image
                    src={banner.image}
                    alt={banner.text}
                    width={1100}
                    height={350}
                    className="banner-image w-full object-cover"
                    priority
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </motion.section>

      {/* Categories */}
      <motion.section
        className="categories"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container">
          <h1 className="section-title">Browse Categories</h1>
          <div className="categories-slider">
            {isLoading.categories ? (
              <CategorySkeleton />
            ) : (
              categories
                .filter((cat) => !cat.hidden)
                .map((cat) => (
                  <Link
                    href={{
                      pathname: "/user/subcategory",
                      query: { category: cat.name },
                    }}
                    key={cat._id}
                    className="category-card"
                  >
                    <div className="category-image">
                      <Image
                        width={100}
                        height={100}
                        src={cat.image}
                        alt={cat.name}
                      />
                    </div>
                    <h3 className="category-title">{cat.name}</h3>
                  </Link>
                ))
            )}
          </div>
        </div>
      </motion.section>

      {/* Featured Products */}
      <motion.section
        className="products"
        id="products"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="section-title">Featured Clothing</h1>
        <div className="product-grid">
          {isLoadingFeed || !feed ? (
            <ProductSkeleton />
          ) : (
            <AnimatePresence>
              {feed.featuredProducts?.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </motion.section>

      {/* Category-wise Products */}
      {isLoadingFeed || !feed
        ? // Show skeletons for 3 category sections while loading
          [...Array(3)].map((_, i) => (
            <motion.section
              key={`skel-cat-${i}`}
              className="products"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <h1
                className="section-title skeleton"
                style={{
                  width: "200px",
                  height: "2rem",
                  margin: "0 auto 1rem",
                }}
              ></h1>
              <div className="product-grid">
                <ProductSkeleton />
              </div>
            </motion.section>
          ))
        : feed.categories.map((cat) => (
            <motion.section
              key={cat._id}
              className="products"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <h1 className="section-title">{cat.name}</h1>
              <div className="product-grid">
                <AnimatePresence>
                  {cat.products.map((product) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.section>
          ))}
    </>
  );
};

export default HomePage;
