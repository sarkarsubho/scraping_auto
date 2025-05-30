import mongoose from "mongoose";

const connectDB = async (uri) => {
  return mongoose
    .connect(uri)
    .then((data) => {
      console.log(`Connected toDB: ${data.connection.host}`);
    })
    .catch((er) => {
      throw er;
    });
};

export { connectDB };
