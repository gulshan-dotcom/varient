import mongoose from "mongoose";

const affilatorSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    image: String,
    id: String,
    isActive: { type: Boolean, default: false },
    balance: { type: Number, default: 0 },

    sales: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
        date: { type: Date, default: Date.now },
      },
    ],

    clicks: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        date: { type: Date, default: Date.now },
      },
    ],

    links: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

export default mongoose.models.Affilator || mongoose.model("Affilator", affilatorSchema);
