"use client";

import React, { useState, useEffect } from "react";
import "@/stylesheets/user/search.css";
import ProductCard from "@/components/ProductCard";

const SearchIcon = () => (
  <svg
    className="search-icon-inside"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const ClearIcon = () => (
  <svg
    className="clear-icon"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const Skeleton = ({ className }) => (
  <div className={`skeleton ${className || ""}`}></div>
);

export default function SearchPage() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suppressSuggestions, setSuppressSuggestions] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);

  const loadSuggestions = async (q) => {
    setSuppressSuggestions(false);
    setSuggestionsLoading(true);
    const res = await fetch("/api/user/products/suggestion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: q }),
    });
    const data = await res.json();
    setSuggestions(data.data || []);
    console.log(data.data);
    setSuggestionsLoading(false);
  };
  useEffect(() => {
    loadSuggestions("");
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      loadSuggestions("");
      return;
    }

    const t = setTimeout(() => {
      loadSuggestions(searchQuery);
    }, 300);

    return () => clearTimeout(t);
  }, [searchQuery]);

  const executeSearch = async (q = searchQuery) => {
    if (!q.trim()) return;

    setProductsLoading(true);
    setSuppressSuggestions(true);
    setSuggestions([]);
    setPage(1);

    const res = await fetch("/api/user/products/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: q, page: 1, limit: 12 }),
    });

    const data = await res.json();

    setProducts(data.data || []);
    setHasMore(data.data.length === 12);
    setProductsLoading(false);
  };

  const loadMore = async () => {
    if (!hasMore || productsLoading) return;

    setProductsLoading(true);
    const nextPage = page + 1;

    const res = await fetch("/api/user/products/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: searchQuery,
        page: nextPage,
        limit: 12,
      }),
    });

    const data = await res.json();

    setProducts((prev) => [...prev, ...data.data]);
    setPage(nextPage);
    setHasMore(data.data.length === 12);
    setProductsLoading(false);
  };

  const handleClear = () => {
    setSearchQuery("");
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setSuppressSuggestions(false);
  };

  const handleSuggestion = (s) => {
    setSuppressSuggestions(true);
    setSearchQuery(s);
    setSuggestions([]);

    executeSearch(s);
  };

  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300
      ) {
        if (products.length > 0) loadMore();
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [page, hasMore]);

  return (
    <>
      <main className="main-content">
        <div className="search-bar-container">
          <div className="search-bar-wrapper">
            <div className="search-bar">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search as your wish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={handleClear} className="clear-btn">
                  <ClearIcon />
                </button>
              )}
            </div>
          </div>
        </div>

        {suggestions.length > 0 && !suppressSuggestions && (
          <>
            <h2 className="suggestions-heading">Popular Searches</h2>
            <div className="suggestions-list">
              {console.log(suggestions)}
              {suggestionsLoading ? (
                <div className="suggestions-skeleton">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="keyword" />
                  ))}
                </div>
              ) : (
                suggestions.slice(0, 12).map((s) => (
                  <button
                    key={s}
                    className="keyword-tag"
                    onClick={() => handleSuggestion(s)}
                  >
                    <SearchIcon />
                    <span>{s}</span>
                  </button>
                ))
              )}
            </div>
          </>
        )}

        <section className="products-section">
          {productsLoading ? (
            <div className="grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card">
                  <Skeleton className="img" />
                  <div className="content">
                    <Skeleton className="title" />
                    <Skeleton className="price" />
                    <Skeleton className="delivery" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state-container">
              <svg
                className="illustration"
                viewBox="0 0 433 559"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
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
                  d="M204.283 460.471L216.84 463.835L213.734 475.426C213.449 476.493 212.352 477.127 211.285 476.841L202.592 474.511C201.525 474.225 200.891 473.129 201.177 472.062L204.283 460.471Z"
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
                    gradientUnits="userSpaceOnUse"
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
                    gradientUnits="userSpaceOnUse"
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
                    gradientUnits="userSpaceOnUse"
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
                    gradientUnits="userSpaceOnUse"
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
                    gradientUnits="userSpaceOnUse"
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
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#1a1a1a" />
                    <stop offset="1" stopColor="#1a1a1a" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <h3 className="illustration-title">Nothing yet! Keep seeking</h3>
              <p className="illustration-subtitle">
                Your beautiful search results will appear here after you type.
              </p>
            </div>
          ) : (
            <div className="grid">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
