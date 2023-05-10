import express from "express";
import path from "path";
import cors from "cors"
import dotenv from "dotenv";
import morgan from "morgan";
import colors from "colors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import recycleRoutes from "./routes/recycleRoutes.js";
import bodyParser from "body-parser";


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));

app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send("API is running....");
});

app.use("/api/recycle", recycleRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, console.log(`Server running on port ${PORT}`.yellow.bold));
