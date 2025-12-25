"use client";
import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { UploadButton } from "@uploadthing/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/stylesheets/admin/addItem.css";
import "@/stylesheets/admin/richtext.css";
import {
  RiH2,
  RiH3,
  RiBold,
  RiItalic,
  RiUnderline,
  RiListUnordered,
  RiListOrdered,
  RiTableLine,
  RiInsertRowBottom,
  RiInsertRowTop,
  RiInsertColumnLeft,
  RiInsertColumnRight,
  RiDeleteRow,
  RiDeleteColumn,
  RiCloseLine,
  RiDeleteBinLine,
  RiLoader2Line,
} from "@remixicon/react";
import { useData } from "@/components/DataContext";
import Image from "next/image";
import { useParams } from "next/navigation";

const Page = () => {
  const { productId } = useParams();
  const [productToEdit, setProductToEdit] = useState(second);
  const { categories } = useData();
  const subcategories = {};

  categories.forEach((cat) => {
    const name = cat;
    subcategories[name.name] = cat.subcategories.map((sub) => sub);
  });

  useEffect(() => {
    const findProduct = async () => {
      const res = await fetch(`/api/user/products/${productId}`);
      const data = await res.json();
      setProductToEdit(data);
    };
    try {
      findProduct();
    } catch (error) {
      toast.error("can not find that product");
      console.log(error);
    }
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    oldPrice: "",
    currentPrice: "",
    description: "",
    sizes: ["S", "M", "L"],
    venderName: "",
    vendorprice: "",
    skuId: "",
    profit: 0,
    maincolor: "",
    categories: [
      {
        category: categories[0]?.name || "Womens Wear",
        subcategory: categories[0]?.subcategories[0] || "Saree",
        categoryId: categories[0]?._id || "",
      },
    ],
    dimension: { length: "", breadth: "", height: "" },
    weight: "",
    tag: ["New Arrival"],
    shiningEffect: false,
    searchable: [],
    inStock: true,
  });
  const [images, setImages] = useState({
    main: [],
  });
  const [newColor, setNewColor] = useState("");
  const [editorData, setEditorData] = useState("");
  const [uploading, setUploading] = useState({});
  const [searchable, setsearchable] = useState("");
  const [allSizes, setAllSizes] = useState(["S", "M", "L", "XL", "2XL", "3XL"]);
  const [customSize, setCustomSize] = useState("");

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      categories: [categories[0]?.name || "Womens Wear"],
      subcategory: categories[0]?.subcategories[0] || "Saree",
    }));
  }, [categories]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [tableData, setTableData] = useState([]);

  const selectedCategoryObj = categories.find(
    (cat) => cat._id === selectedCategoryId
  );

  const handleAdd = (e) => {
    e.preventDefault();
    if (!selectedCategoryId || !selectedSubcategory) return;

    const newRow = {
      categoryId: selectedCategoryId,
      category: selectedCategoryObj?.name,
      subcategory: selectedSubcategory,
    };

    // prevent duplicate
    const exists = tableData.some(
      (row) =>
        row.categoryId === newRow.categoryId &&
        row.subcategory === newRow.subcategory
    );

    if (!exists) {
      setTableData([...tableData, newRow]);
    }

    // reset inputs
    setSelectedCategoryId("");
    setSelectedSubcategory("");
  };

  useEffect(() => {
    setFormData((prev) => ({ ...prev, categories: tableData }));
  }, [tableData]);

  const handleDelete = (index, e) => {
    console.log(formData, tableData);
    e.preventDefault();
    setTableData(tableData.filter((_, i) => i !== index));
  };

  const handlesearchableChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setsearchable(value);
    setFormData((prev) => ({
      ...prev,
      searchable: value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    }));
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Underline,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: editorData,
    onUpdate: ({ editor }) => {
      setEditorData(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, description: editorData }));
  }, [editorData]);

  useEffect(() => {
    if (productToEdit) {
      const mappedTable =
        productToEdit.categoryData?.map((c) => ({
          categoryId: c.categoryId,
          category: c.categoryName,
          subcategory: c.subcategory,
        })) || [];

      if (productToEdit && editor) {
        editor.commands.setContent(productToEdit.description || "");
      }

      setFormData({
        title: productToEdit.title || "",
        oldPrice: productToEdit.oldPrice || "",
        currentPrice: productToEdit.currentPrice || "",
        description: productToEdit.description || "",
        sizes: productToEdit.sizes || ["S", "M", "L"],
        venderName: productToEdit.venderName || "",
        vendorprice: productToEdit.vendorprice || "",
        skuId: productToEdit.skuId || "",
        profit: productToEdit.profit || 0,
        maincolor: productToEdit.maincolor || "",
        categories:
          productToEdit.categoryData?.map((c) => ({
            category: c.categoryName,
            subcategory: c.subcategory,
            categoryId: c.categoryId,
          })) || [],
        dimension: {
          length: productToEdit.dimension.length || "",
          breadth: productToEdit.dimension.breadth || "",
          height: productToEdit.dimension.height || "",
        },
        weight: productToEdit.weight || "",
        tag: productToEdit.tag?.length ? productToEdit.tag : ["New Arrival"],
        shiningEffect: productToEdit.shiningEffect || false,
        searchable: productToEdit.searchable || [],
        inStock: productToEdit.inStock ?? true,
      });
      setAllSizes((prevSizes) =>
        Array.from(new Set([...prevSizes, ...(productToEdit.sizes || [])]))
      );

      setImages(productToEdit.images || { main: {} });
      setsearchable(
        productToEdit.searchable ? productToEdit.searchable.join(", ") : ""
      );
      setEditorData(productToEdit.description || "");

      setTableData(mappedTable);
    }
  }, [productToEdit, editor]);

  const toggleSize = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const selectTag = (tag) => {
    if (formData.tag.includes(tag)) {
      setFormData((prev) => {
        return { ...prev, tag: [...prev.tag.filter((item) => item !== tag)] };
      });
    } else {
      setFormData((prev) => {
        return { ...prev, tag: [...prev.tag, tag] };
      });
    }
    console.log(formData.tag);
  };

  const addColor = () => {
    if (newColor && !Object.keys(images).includes(newColor)) {
      setImages((prev) => ({
        ...prev,
        [newColor]: [],
      }));
      setNewColor("");
      toast.success(`Color "${newColor}" added!`);
    } else if (!newColor) {
      toast.error("Please enter a color name.");
    } else {
      toast.error("Color already exists.");
    }
  };

  const removeColor = (color) => {
    setImages((prev) => {
      const newImages = { ...prev };
      delete newImages[color];
      return newImages;
    });
    toast.success(`Color "${color}" removed!`);
  };

  const removeImage = (color, index) => {
    setImages((prev) => ({
      ...prev,
      [color]: prev[color].filter((_, i) => i !== index),
    }));
    toast.success("Image removed!");
  };

  const handleImageUpload = (color, res) => {
    setUploading((prev) => ({ ...prev, [color]: false }));
    const newImageUrl = res[0].ufsUrl;
    console.log(res[0]);
    setImages((prev) => ({
      ...prev,
      [color]: [...prev[color], { image: newImageUrl, type: res[0].type }],
    }));
    toast.success("Image uploaded successfully!");
  };

  const validateForm = () => {
    if (!formData.title) return "Title is required.";
    if (!formData.oldPrice) return "Old price is required.";
    if (!formData.currentPrice) return "Current price is required.";
    if (!formData.description) return "Description is required.";
    if (!images.main || images.main.length === 0)
      return "At least one main image is required.";
    if (formData.categories.length === 0)
      return "At least one category is required.";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      const categoryMapped = tableData.map((row) => ({
        categoryId: row.categoryId,
        categoryName: row.category, // rename here
        subcategory: row.subcategory,
      }));

      console.log({
        ...formData,
        categoryData: categoryMapped,
        images,
      });

      toast.loading("Updating product...");

      const res = await fetch(`/api/admin/items/update/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          categoryData: categoryMapped,
          images,
          dimension: {
            length: Number(formData.dimension.length),
            breadth: Number(formData.dimension.breadth),
            height: Number(formData.dimension.height),
          },
          weight: Number(formData.weight),
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.dismiss();
        toast.success("Product updated successfully!");
      } else {
        toast.dismiss();
        toast.error(data.message || "Failed to update product.");
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Something went wrong!");
      console.error(err);
    }
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      profit: formData.currentPrice - formData.vendorprice,
    }));
  }, [formData.currentPrice, formData.vendorprice]);

  return (
    <main className="adminAddItem">
      <ToastContainer position="top-right" autoClose={3000} />
      <form onSubmit={onSubmit}>
        <div className="form-section">
          <h2>Product Title</h2>
          <input
            type="text"
            name="title"
            className="title-input"
            placeholder="Enter product title..."
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-section">
          <h2>Price</h2>
          <div className="price-fields">
            <input
              type="number"
              name="oldPrice"
              className="price-input"
              placeholder="Enter old price (e.g., &#8377;5999)"
              value={formData.oldPrice}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="currentPrice"
              className="price-input"
              placeholder="Enter current price (e.g., &#8377;4999)"
              value={formData.currentPrice}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="vendorprice"
              className="price-input"
              placeholder="Enter vendor price (e.g., &#8377;4999)"
              value={formData.vendorprice}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="profit"
              className="price-input"
              placeholder="Enter total profit/margin (e.g., &#8377;4999)"
              value={formData.profit}
              onChange={handleInputChange}
              required
            />{" "}
            {formData.vendorprice > 0
              ? (
                  ((formData.currentPrice - formData.vendorprice) /
                    formData.currentPrice) *
                  100
                ).toFixed(2)
              : 0}
            %
          </div>
        </div>
        <div className="form-section">
          <h2>Vendor Name</h2>
          <input
            type="text"
            name="venderName"
            className="title-input"
            placeholder="Enter vendor name"
            value={formData.venderName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-section">
          <h2>SKU ID</h2>
          <input
            type="text"
            name="skuId"
            className="title-input"
            placeholder="Enter SKU no."
            value={formData.skuId}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-section">
          <h2>Details</h2>
          {editor && (
            <div className="editor-container">
              <div className="editor-toolbar">
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  className={
                    editor.isActive("heading", { level: 2 }) ? "active" : ""
                  }
                  title="Heading 2"
                >
                  <RiH2 />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                  className={
                    editor.isActive("heading", { level: 3 }) ? "active" : ""
                  }
                  title="Heading 3"
                >
                  <RiH3 />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={editor.isActive("bold") ? "active" : ""}
                  title="Bold"
                >
                  <RiBold />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={editor.isActive("italic") ? "active" : ""}
                  title="Italic"
                >
                  <RiItalic />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={editor.isActive("underline") ? "active" : ""}
                  title="Underline"
                >
                  <RiUnderline />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  className={editor.isActive("bulletList") ? "active" : ""}
                  title="Bullet List"
                >
                  <RiListUnordered />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                  className={editor.isActive("orderedList") ? "active" : ""}
                  title="Ordered List"
                >
                  <RiListOrdered />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                      .run()
                  }
                  className={editor.isActive("table") ? "active" : ""}
                  title="Insert Table"
                >
                  <RiTableLine />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().addRowBefore().run()}
                  className=""
                  title="Add Row Before"
                  disabled={!editor || !editor.can().addRowBefore()}
                >
                  <RiInsertRowTop />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().addRowAfter().run()}
                  className=""
                  title="Add Row After"
                  disabled={!editor || !editor.can().addRowAfter()}
                >
                  <RiInsertRowBottom />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().addColumnBefore().run()}
                  className=""
                  title="Add Column Before"
                  disabled={!editor || !editor.can().addColumnBefore()}
                >
                  <RiInsertColumnLeft />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().addColumnAfter().run()}
                  className=""
                  title="Add Column After"
                  disabled={!editor || !editor.can().addColumnAfter()}
                >
                  <RiInsertColumnRight />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().deleteRow().run()}
                  className=""
                  title="Delete Row"
                  disabled={!editor || !editor.can().deleteRow()}
                >
                  <RiDeleteRow />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().deleteColumn().run()}
                  className=""
                  title="Delete Column"
                  disabled={!editor || !editor.can().deleteColumn()}
                >
                  <RiDeleteColumn />
                </button>
              </div>
              <EditorContent editor={editor} className="editor-content" />
            </div>
          )}
        </div>
        <div className="form-section">
          <h2>Product Sizes</h2>
          <div className="size-selection">
            {allSizes.map((size) => (
              <div key={size} className="size-box">
                <button
                  type="button"
                  className={`tag-btn ${
                    formData.sizes.includes(size) ? "selected" : ""
                  }`}
                  onClick={() => toggleSize(size)}
                >
                  {size}
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 my-2.5">
            <input
              type="text"
              value={customSize}
              onChange={(e) => setCustomSize(e.target.value)}
              placeholder="Add custom size"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => {
                const trimmedSize = customSize.trim().toUpperCase();
                if (trimmedSize && !allSizes.includes(trimmedSize)) {
                  setAllSizes([...allSizes, trimmedSize]);
                  setCustomSize("");
                }
              }}
              className="px-4 py-2 bg-amber-400 text-white rounded-md text-sm hover:bg-amber-500"
            >
              Add
            </button>
          </div>
        </div>
        <div className="form-section">
          <h2>Product Colors</h2>

          {/* MAIN IMAGES */}
          <div className="image-gallery">
            {images.main.map((media, i) => {
              const isVideo = media.type === "video/mp4";
              return (
                <div className="image-box" key={i}>
                  {isVideo ? (
                    <div className="video-thumbnail">
                      <video
                        src={media.image}
                        width={100}
                        height={100}
                        muted
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
                      height={100}
                      width={100}
                      src={media.image}
                      alt={`Main Image ${i + 1}`}
                    />
                  )}
                  <span
                    className="remove-btn"
                    onClick={() => removeImage("main", i)}
                  >
                    <RiCloseLine />
                  </span>
                </div>
              );
            })}

            {/* ADD IMAGE/VIDEO BUTTON */}
            <div className="image-box add-image">
              <UploadButton
                endpoint="mediaUploader"
                onUploadBegin={() => {
                  setUploading((prev) => ({
                    ...prev,
                    main: true,
                  }));
                  toast.info("Uploading image...");
                }}
                appearance={{
                  label: "custom-dropzone-label",
                  button: "custom-dropzone-button",
                }}
                onClientUploadComplete={(res) => handleImageUpload("main", res)}
                onUploadError={(error) => {
                  setUploading((prev) => ({
                    ...prev,
                    main: false,
                  }));
                  toast.error(`Upload failed: ${error.message}`);
                }}
                content={{
                  button({ ready }) {
                    return uploading.main ? (
                      <div className="uploading-loader">
                        <RiLoader2Line />
                      </div>
                    ) : (
                      ready && (
                        <div className="add-image-content">
                          <svg
                            className="singleSvg"
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
                        </div>
                      )
                    );
                  },
                }}
                className="custom-upload-btn"
              />
            </div>
          </div>

          {/* COLOR VARIANTS */}
          <div className="color-selection">
            {Object.keys(images).map(
              (color, index) =>
                color !== "main" &&
                color !== "maincolor" && (
                  <div key={index} className="color-section">
                    <div className="color-header">
                      <h2>{color}</h2>
                      <button
                        type="button"
                        className="delete-color-btn"
                        onClick={() => removeColor(color)}
                        title={`Remove ${color}`}
                      >
                        <RiDeleteBinLine />
                      </button>
                    </div>

                    {/* IMAGES/VIDEOS FOR THIS COLOR */}
                    <div className="image-gallery">
                      {images[color].map((media, index) => {
                        const isVideo = media.type === "video/mp4";
                        console.log(isVideo, media);
                        return (
                          <div className="image-box" key={index}>
                            {isVideo ? (
                              <div className="video-thumbnail">
                                <video
                                  src={media.image}
                                  width={100}
                                  height={100}
                                  muted
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
                                height={100}
                                width={100}
                                src={media.image}
                                alt={`${color} Image ${index + 1}`}
                              />
                            )}
                            <span
                              className="remove-btn"
                              onClick={() => removeImage(color, index)}
                            >
                              <RiCloseLine />
                            </span>
                          </div>
                        );
                      })}

                      {/* ADD MEDIA BUTTON */}
                      <div className="image-box add-image">
                        <UploadButton
                          endpoint="mediaUploader"
                          autoUpload={true}
                          onUploadBegin={() => {
                            setUploading((prev) => ({
                              ...prev,
                              [color]: true,
                            }));
                            toast.info("Uploading image...");
                          }}
                          appearance={{
                            label: "custom-dropzone-label",
                            button: "custom-dropzone-button",
                          }}
                          onClientUploadComplete={(res) => {
                            handleImageUpload(color, res);
                          }}
                          onUploadError={(error) => {
                            setUploading((prev) => ({
                              ...prev,
                              [color]: false,
                            }));
                            toast.error(`Upload failed: ${error.message}`);
                          }}
                          content={{
                            button({ ready }) {
                              return uploading[color] ? (
                                <div className="uploading-loader">
                                  <RiLoader2Line />
                                </div>
                              ) : (
                                ready && (
                                  <div className="add-image-content">
                                    <svg
                                      className="singleSvg"
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
                                  </div>
                                )
                              );
                            },
                          }}
                          className="custom-upload-btn"
                        />
                      </div>
                    </div>
                  </div>
                )
            )}

            {/* ADD COLOR INPUT */}
            <div className="color-input">
              <input
                type="text"
                placeholder="Enter color name..."
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
              />
              <button
                type="button"
                className="add-color-btn"
                onClick={addColor}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Color
              </button>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Main color Placeholder</h2>
          <input
            type="text"
            name="maincolor"
            className="title-input"
            placeholder="any name for the main color"
            value={formData.maincolor}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, maincolor: e.target.value }));
            }}
            required
          />
        </div>
        <div className="form-section">
          <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Assign Categories</h2>

            {/* Dropdowns */}
            <div className="flex gap-4 mb-4">
              <select
                className="border rounded px-3 py-2 w-1/3"
                value={selectedCategoryId}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value);
                  setSelectedSubcategory("");
                }}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                className="border rounded px-3 py-2 w-1/3"
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                disabled={!selectedCategoryObj}
              >
                <option value="">Select Subcategory</option>
                {selectedCategoryObj?.subcategories.map((sub) => (
                  <option key={sub.name} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAdd}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>

            {/* Table */}
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left">Category</th>
                  <th className="border px-4 py-2 text-left">Subcategory</th>
                  <th className="border px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{row.category}</td>
                    <td className="border px-4 py-2">{row.subcategory}</td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={(e) => handleDelete(index, e)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {tableData.length === 0 && (
                  <tr>
                    <td
                      colSpan="3"
                      className="text-center py-3 text-gray-500 border"
                    >
                      No categories assigned
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="form-section">
          <h2>Tags</h2>
          <div className="tags-selection">
            {["New Arrival", "Popular", "Best Selling", "Featured"].map(
              (tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`tag-btn ${
                    formData.tag.includes(tag) ? "selected" : ""
                  }`}
                  data-tag={tag.toLowerCase()}
                  onClick={() => selectTag(tag)}
                >
                  {tag}
                </button>
              )
            )}
          </div>
        </div>
        <div className="form-section">
          <h2>searchable keywords</h2>
          <input
            type="text"
            name="title"
            className="title-input"
            placeholder="separate by commas e.g. saree, silk saree, designer saree"
            value={searchable}
            onChange={handlesearchableChange}
            required
          />
        </div>
        <div className="form-section">
          <h2 className="section-heading">Dimensions & Weight</h2>

          <div className="form-group color-input inputBox">
            <label className="form-label">Dimensions (l,b,h)</label>
            <div className="grid grid-cols-3 gap-3">
              <input
                type="number"
                placeholder="Length"
                className="folor-input"
                value={formData.dimension.length}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dimension: {
                      ...formData.dimension,
                      length: e.target.value,
                    },
                  })
                }
              />
              <input
                type="number"
                placeholder="Breadth"
                className="folor-input"
                value={formData.dimension.breadth}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dimension: {
                      ...formData.dimension,
                      breadth: e.target.value,
                    },
                  })
                }
              />
              <input
                type="number"
                placeholder="Height"
                className="form-control"
                value={formData.dimension.height}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dimension: {
                      ...formData.dimension,
                      height: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>

          <div className="form-group color-input inputBox mt-4">
            <label className="form-label">Weight</label>
            <input
              type="number"
              placeholder="Ex: 0.350"
              className="form-control"
              value={formData.weight}
              onChange={(e) =>
                setFormData({ ...formData, weight: e.target.value })
              }
            />
          </div>
        </div>
        <div className="form-section">
          <h2>Shining Effect</h2>
          <div className="shining-toggle">
            <span className="toggle-label">Shining Effect</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                name="shiningEffect"
                checked={formData.shiningEffect}
                onChange={handleInputChange}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
        <div className="form-section">
          <h2>Stock Status</h2>
          <div className="stock-toggle">
            <span className="toggle-label">In Stock</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleInputChange}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
        <div className="form-section">
          <button type="submit" className="submit-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            Add Product
          </button>
        </div>
      </form>
      <div className="profit-calculator">
        your profit from product {formData.currentPrice - formData.vendorprice}{" "}
        /{" "}
        {formData.vendorprice > 0
          ? (
              ((formData.currentPrice - formData.vendorprice) /
                formData.currentPrice) *
              100
            ).toFixed(2)
          : 0}
        %
      </div>
    </main>
  );
};

export default Page;
