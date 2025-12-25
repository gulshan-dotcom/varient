import Image from "next/image";
import Link from "next/link";
import React from "react";
import "@/stylesheets/productCard.css";
import { useData } from "./DataContext";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ProductCard = ({
  product,
  showUserActions = true,
  showActions = false,
}) => {
  const { dbUser, reload } = useData();
  const { data: session, status } = useSession();
  const router = useRouter();

  const addToCart = async (productId, color, size) => {
    if (status !== "loading" && !session) {
      router.push("/user/login");
      toast.info("Please log in to add items to your cart", {
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
      console.log(data,"respnonsj")

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
  return (
    <div className="user-product-card">
      <Link href={`/user/item/details/${product._id}`}>
        <div className="product-image">
          <Image
            src={product.images.main[0].image}
            alt={product.title}
            width={250}
            height={300}
            className="product-image"
          />
          {product.tag.length > 0 && (
            <div
              className={`product-badge ${
                product.shiningEffect ? "shine" : ""
              }`}
            >
              {product.tag[0]}
            </div>
          )}
        </div>
      </Link>
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <div className="product-price">
          <span className="price-current">&#8377;{product.currentPrice}</span>
          <span className="price-original">&#8377;{product.oldPrice}</span>
        </div>
        {showUserActions && (
          <button
            className="add-to-cart"
            onClick={() =>
              addToCart(product._id, product.maincolor, product.sizes[0])
            }
          >
            <span>Add to Cart</span>
          </button>
        )}
        {showActions && showActions(product)}
      </div>
    </div>
  );
};

export default ProductCard;
