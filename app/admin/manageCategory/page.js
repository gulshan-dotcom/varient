"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/components/DataContext";
import "@/stylesheets/admin/categories.css";
import { toast, ToastContainer } from "react-toastify";
import { UploadButton } from "@uploadthing/react";

const Page = () => {
  const { categories, reload } = useData();
  const [openCategory, setOpenCategory] = useState(null);
  const [categoryInput, setCategoryInput] = useState("");
  const [subcategoryInput, setSubcategoryInput] = useState("");
  const [subcategoryForms, setSubcategoryForms] = useState({});

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (categoryInput.trim() && subcategoryInput.trim()) {
      try {
        const response = await fetch("/api/admin/category/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            categoryName: categoryInput.trim(),
            subcategoryName: subcategoryInput.trim(),
          }),
        });
        if (response.ok) {
          toast.success("Category added successfully! Reloading Categories");
          reload("categories");
          setCategoryInput("");
          setSubcategoryInput("");
        } else {
          throw new Error("Failed to add category");
        }
      } catch (error) {
        console.error("Error adding category:", error);
        toast.error("Failed to add category. Please try again.");
      }
    } else {
      toast.info("Both category name and subcategory name are required.");
    }
  };

  const handleAddSubcategory = async (categoryName, subcategoryName) => {
    if (subcategoryName?.trim()) {
      try {
        const response = await fetch("/api/admin/category/subcategory/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            categoryName: categoryName.trim(),
            subcategoryName: subcategoryName.trim(),
          }),
        });
        if (response.ok) {
          toast.success(
            "Subcategory added successfully! Reloading categories..."
          );
          reload("categories");
          setSubcategoryForms({ ...subcategoryForms, [categoryName]: "" });
        } else {
          throw new Error("Failed to add subcategory");
        }
      } catch (error) {
        console.error("Error adding subcategory:", error);
        toast.error("Failed to add subcategory. Please try again.");
      }
    } else {
      toast.info("Subcategory name is required.");
    }
  };

  const handleDeleteCategory = async (categoryName) => {
    const confirm = window.prompt(`type "${categoryName}"?`);

    if (confirm.toLocaleLowerCase() !== categoryName.toLocaleLowerCase()) {
      toast.info("aborted deletion");
      return;
    }
    try {
      const response = await fetch("/api/admin/category/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryName: categoryName }),
      });
      if (response.ok) {
        toast.success("Category deleted successfully! Reloading categories...");
        reload("categories");
        if (openCategory === categoryName) setOpenCategory(null);
      } else {
        throw new Error("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category. Please try again.");
    }
  };

  const handleDeleteSubcategory = async (categoryName, subcategoryName) => {
    const confirm = window.prompt(`type "${subcategoryName}"?`);
    if (confirm.toLocaleLowerCase() !== subcategoryName.toLocaleLowerCase()) {
      toast.info("aborted deletion");
      return;
    }
    try {
      const response = await fetch("/api/admin/category/subcategory/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryName: categoryName.trim(),
          subcategoryName: subcategoryName.trim(),
        }),
      });
      if (response.ok) {
        toast.success(
          "Subcategory deleted successfully! Reloading categories..."
        );
        reload("categories");
      } else {
        throw new Error("Failed to delete subcategory");
      }
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      toast.error("Failed to delete subcategory. Please try again.");
    }
  };

  const toggleCategory = (categoryId) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  const handleSubcategoryInputChange = (categoryId, value) => {
    setSubcategoryForms({ ...subcategoryForms, [categoryId]: value });
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const contentVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: "auto",
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const handleImageUpload = async (res, categoryName) => {
    const newImageUrl = res[0]?.ufsUrl;
    try {
      const response = await fetch("/api/admin/category/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryName,
          categoryImage: newImageUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Updated Category:", data.category);
        reload("categories");
      } else {
        toast.error("Error:", data.error);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleToggleCategory = async (categoryName) => {
    toast.success(`Category visibility changing...`);
    try {
      const response = await fetch("/api/admin/category/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryName }),
      });

      if (response.ok) {
        reload("categories");
      } else {
        toast.error("Failed to update category visibility");
      }
    } catch (error) {
      console.error("Error toggling category:", error);
      toast.error("Error changing category visibility");
    }
  };

  const handleSubImageUpload = async (res, categoryName, subcategoryName) => {
    const newImageUrl = res[0]?.ufsUrl;
    try {
      const response = await fetch("/api/admin/category/subcategory/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryName,
          subcategoryName,
          categoryImage: newImageUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Updated subCategory:", data.category);
        reload("categories");
      } else {
        toast.error("Error:", data.error);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  return (
    <motion.main
      className="main-content"
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="category-form">
        <input
          type="text"
          placeholder="Enter category name..."
          value={categoryInput}
          onChange={(e) => setCategoryInput(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter sub-category name..."
          value={subcategoryInput}
          onChange={(e) => setSubcategoryInput(e.target.value)}
        />
        <button className="add-category-btn" onClick={handleAddCategory}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Category
        </button>
      </div>

      <div className="category-accordion">
        {categories.map((category) => (
          <div key={category._id} className="category-item">
            <div
              className="category-header"
              onClick={() => toggleCategory(category._id)}
            >
              <Image
                src={category.image || "/images/placeholder.jpg"}
                alt={category.name}
                width={80}
                height={80}
                className="category-image"
              />
              <h2>{category.name}</h2>
              <div className="category-actions">
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(category.name);
                  }}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <UploadButton
                  className="upload-btn"
                  endpoint="imageUploader"
                  onUploadBegin={() => toast.info("Uploading image...")}
                  onClientUploadComplete={(res) =>
                    handleImageUpload(res, category.name)
                  }
                  onUploadError={(error) => {
                    toast.error(`Upload failed: ${error.message}`);
                  }}
                />
                <svg
                  className={`toggle-icon ${
                    openCategory === category._id ? "open" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <AnimatePresence>
              {openCategory === category._id && (
                <motion.div
                  className="category-content"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={contentVariants}
                >
                  <div className="subcategory-form">
                    <input
                      type="text"
                      placeholder="Enter sub-category name..."
                      value={subcategoryForms[category._id] || ""}
                      onChange={(e) =>
                        handleSubcategoryInputChange(
                          category._id,
                          e.target.value
                        )
                      }
                    />
                    <button
                      className="add-subcategory-btn"
                      onClick={() =>
                        handleAddSubcategory(
                          category.name,
                          subcategoryForms[category._id]
                        )
                      }
                    >
                      <svg
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
                      Add
                    </button>
                  </div>
                  <div className="subcategory-list">
                    {category.subcategories.map((subcategory) => (
                      <div
                        key={subcategory._id || subcategory.name}
                        className="subcategory-item"
                      >
                        <Image
                          src={subcategory.image || "/images/placeholder.jpg"}
                          alt={subcategory.name}
                          width={80}
                          height={80}
                          className="subcategory-image"
                        />
                        <p>{subcategory.name}</p>
                        <UploadButton
                          className="upload-btn"
                          endpoint="imageUploader"
                          onUploadBegin={() =>
                            toast.info("Uploading subcategory image...")
                          }
                          onClientUploadComplete={(res) =>
                            handleSubImageUpload(
                              res,
                              category.name,
                              subcategory.name
                            )
                          }
                          onUploadError={(error) => {
                            toast.error(`Upload failed: ${error.message}`);
                          }}
                        />
                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDeleteSubcategory(
                              category.name,
                              subcategory.name
                            )
                          }
                        >
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      className={`hide-btn ${
                        category.hidden ? "inactive" : "active"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleCategory(category.name);
                      }}
                    >
                      {category.hidden ? "Unhide" : "Hide"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.main>
  );
};

export default Page;
