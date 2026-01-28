import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import routerUser from "routes/user";
import routerFriend from "routes/friend";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/App";
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/user", routerUser);
app.use("/friend", routerFriend);

mongoose
  .connect(MONGO_URI)
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`)),
  )
  .catch((err) => console.log(err));
