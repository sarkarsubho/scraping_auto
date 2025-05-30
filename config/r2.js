// import AWS from "aws-sdk";

// const s3 = new AWS.S3({
//   accessKeyId: process.env.R2_ACCESS_KEY_ID,
//   secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
//   endpoint: process.env.R2_ENDPOINT, // e.g., 'https://<accountid>.r2.cloudflarestorage.com'
//   region: "auto",
//   signatureVersion: "v4",
// });

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT, // e.g. https://<accountid>.r2.cloudflarestorage.com
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export { s3Client, PutObjectCommand };
