import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    filename: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Video = mongoose.model("Video", videoSchema);

export { Video };
