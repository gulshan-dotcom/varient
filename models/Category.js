import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subcategories: [
      {
        _id: false,
        name: {
          type: String,
          trim: true,
        },
        image: String,
      },
    ],
    image: String,
    hidden: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Category ||
  mongoose.model("Category", categorySchema);
