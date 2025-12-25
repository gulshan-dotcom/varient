import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    categoryData: [
      {
        _id: false,
        categoryName: { type: String, required: true },
        categoryId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
          required: true,
        },
        subcategory: { type: String, required: true },
      },
    ],
    tag: [{ type: String }],

    oldPrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    venderName: { type: String },
    vendorprice: { type: Number, required: true },
    skuId: { type: String },
    profit: { type: Number, default: 0 },
    maincolor: { type: String, required: true },

    sizes: { type: [String], required: true },
    images: { type: Object, required: true },
    searchable: { type: [String], default: [] },
    dimension: {
      length: { type: Number, required: true },
      breadth: { type: Number, required: true },
      height: { type: Number, required: true },
    },
    weight: { type: Number, required: true },

    inStock: { type: Boolean, default: true },
    shiningEffect: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
