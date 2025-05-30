import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./config/bd.js";
import uploadRouteHandler from "./routes/upload.route.js"

const app = express();
const baseURL = "/api/v1";
dotenv.config();

app.use(express.json());

app.use(baseURL,uploadRouteHandler);


app.get("/", async (req, res) => {
 return res.status(200).send({ message: "hello from scraping server" });
});

app.listen(8080, async () => {
  try {
    await connectDB(process.env.MONGO_URI)
      .then((res) => {
        console.log("MongoDb Connected successfully");
      })
      .catch((er) => {
        console.log(er);
      });
  } catch (error) {}
});
