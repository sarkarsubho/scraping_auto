import express from "express";
import multer from "multer";
import { s3Client, PutObjectCommand } from "../config/r2.js";
import { Video } from "../models/video.models.js";
const router = express.Router();
import path from "path";
import { v4 } from "uuid";
import { getVideos } from "../index.js";
import { error } from "console";
import { uploadVideos } from "../controllers/uploadController.js";

const upload = multer({ storage: multer.memoryStorage() });

// router.post("/scrapAndUpload", async (req, res) => {
//   return res.status(200).send({ msg: "scrap and uploaded successfully" });
// });

router.post(
  "/scrapAndUpload",
  // upload.single("video"),
  async (req, res) => {
    try {
      let { url } = req.body;
      console.log(url);

      // let isGotvideos = await getVideos(url);

      // if (isGotvideos.status === false) {
      //   return res.status(400).send(isGotvideos);
      // }

      let uploadStatus = await uploadVideos();

      if (uploadStatus.status === false) {
        return res.status(400).send(uploadStatus);
      }

      res.status(200)
      // .json({ message: "Upload successful", data: isGotvideos });
      .json({ message: "Upload successful", data: uploadStatus?.data });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed", error: err.message });
    }
  }
);

export default router;
