import React from "react";

const DetailSkeleton = () => {
  return (
    <div className="product-container">
      {/* Left: Image Gallery Skeleton */}
      <div className="product-gallery">
        {/* Main Image */}
        <div className="detail-skeleton skeleton-gallery"></div>

        {/* Thumbnails */}
        <div className="gallery-thumbnails skeleton-thumbnails">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="detail-skeleton skeleton-thumbnail"></div>
          ))}
        </div>
      </div>

      {/* Right: Product Info Skeleton */}
      <div className="product-info">
        {/* Brand & Title */}
        <div
          className="detail-skeleton"
          style={{ height: "1.2rem", width: "120px", marginBottom: "1rem" }}
        ></div>
        <div className="detail-skeleton skeleton-title"></div>

        {/* Price */}
        <div className="detail-skeleton skeleton-price"></div>
        <div
          className="detail-skeleton"
          style={{ height: "1.2rem", width: "40%", marginTop: "0.5rem" }}
        ></div>

        {/* Color Variants */}
        <div className="color-variants skeleton-color-variants">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="detail-skeleton skeleton-color-option"
            ></div>
          ))}
        </div>

        {/* Action Buttons */}
        <div
          className="action-buttons"
          style={{ marginTop: "2rem", display: "flex", gap: "0.75rem" }}
        >
          <div className="detail-skeleton skeleton-button"></div>
          <div className="detail-skeleton skeleton-button"></div>
          <div
            className="detail-skeleton skeleton-button"
            style={{ flex: "0.5" }}
          ></div>
        </div>

        {/* Description Lines */}
        <div style={{ marginTop: "3rem" }}>
          <div
            className="detail-skeleton"
            style={{ height: "1.8rem", width: "200px", marginBottom: "1.5rem" }}
          ></div>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`detail-skeleton skeleton-desc-line ${
                i % 3 === 0 ? "short" : i % 3 === 1 ? "medium" : ""
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailSkeleton;
