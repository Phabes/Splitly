import "dotenv/config";
import { setServers } from "node:dns/promises";
import express, { Express, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import routerUser from "./routes/users.ts";
import routerFriend from "./routes/friends.ts";
import routerGroup from "./routes/groups.ts";
import routerCurrency from "./routes/currencies.ts";
import routerBill from "./routes/bills.ts";
import { initCurrencies } from "./services/currencies.ts";

const MONGO_URI: string =
  process.env.MONGO_URI || "mongodb://localhost:27017/App";
const PORT: number = Number(process.env.PORT) || 5000;

const app: Express = express();

app.use(cors());
app.use(express.json());

app.use("/users", routerUser);
app.use("/friends", routerFriend);
app.use("/groups", routerGroup);
app.use("/currencies", routerCurrency);
app.use("/bills", routerBill);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    code: "server/internal-error",
    message: "An unexpected server error occurred.",
  });
});

const startServer = async (): Promise<void> => {
  try {
    setServers(["1.1.1.1", "8.8.8.8"]);

    await mongoose.connect(MONGO_URI);
    await initCurrencies();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

void startServer();
