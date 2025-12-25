import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    image: String,
    link: String,
    text: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Banner || mongoose.model("Banner", bannerSchema);