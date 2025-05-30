import fs from "fs";
import path from "path";
import util from "util";
import { s3Client as s3, PutObjectCommand } from "../config/r2.js";
import { Video } from "../models/video.models.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Promisify readDir and unlink
const readDir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);
const readFile = util.promisify(fs.readFile);
dotenv.config();


const sanitizeFileName = (name) =>
  name.replace(/\s+/g, "-").replace(/[^\w.-]/g, "");

const uploadVideos = async () => {
  const folderPath = path.join(__dirname, "../videos");

  try {
    const files = await readDir(folderPath);
    const videoFiles = files.filter((file) =>
      /\.(mp4|mov|mkv|avi)$/i.test(file)
    );

    let uploadedDetails = [];

    for (const file of videoFiles) {
      const filePath = path.join(folderPath, file);
      const fileBuffer = await readFile(filePath);
      const key = `${Date.now()}-${sanitizeFileName(file)}`;

      const isVideoAvailable = await Video.find({ filename: file });

      if (isVideoAvailable) {
        console.log(`✅ already Uploaded : ${file}`);
        console.log("Skipped upload");
        continue;
      }
      console.log("video not found uploading");

      // Upload to R2
      const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: key,
        Body: fileBuffer,
        ContentType: "video/mp4", // change if needed
      });

      let uploadedResult = await s3.send(command);
      console.log("uploadedResult", uploadedResult);

      const fileUrl = `${process.env.R2_PUBLIC_URL}/${process.env.R2_BUCKET}/${key}`;

      // Save to MongoDB
      const video = new Video({ filename: file, url: fileUrl });
      const savedVideo = await video.save();

      uploadedDetails.push(savedVideo);
      console.log(`✅ Uploaded & saved: ${file}`);

      // Delete local file
      await unlink(filePath);
      console.log(`🗑️ Deleted local file: ${file}`);
    }

    console.log("🎉 All videos uploaded and cleaned up");
    return { status: true, data: uploadedDetails };
  } catch (err) {
    console.error("❌ Error during upload process:", err);
    return { status: false, message: err.message };
  }
};

// uploadVideos();
export { uploadVideos };
