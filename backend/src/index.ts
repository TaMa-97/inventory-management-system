import express from "express";
import cors from "cors";
import { productRouter } from "./routes/products.js";
import { categoryRouter } from "./routes/categories.js";
import { setupDatabase } from "./database.js";

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL ||
          "https://dashing-sunburst-937eb9.netlify.app/"
        : true,
    credentials: true,
  })
);

app.use(express.json());

// データベースのセットアップ
setupDatabase();

// Health check endpoint
app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

// API routes
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
