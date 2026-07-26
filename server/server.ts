import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import routerUser from "./routes/users.ts";
import routerFriend from "./routes/friends.ts";
import routerGroup from "./routes/groups.ts";
import routerCurrency from "./routes/currencies.ts";
import { initCurrencies } from "./services/currencies.ts";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/App";
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", routerUser);
app.use("/friends", routerFriend);
app.use("/groups", routerGroup);
app.use("/currencies", routerCurrency);

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    await initCurrencies();
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`)),
  )
  .catch((error) => console.log(error));
