import express, { Application } from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user.routes";
import dotenv from "dotenv";
import cors from "cors";
import newsRouter from "./routes/news.routes";
import productRouter from "./routes/product.routes";
import path from "path";
import formsRouter from "./routes/forms.routes";
// import * as mysql from "mysql2";
dotenv.config();

const app: Application = express();
const PORT: number | string | undefined = process.env.PORT || "";
const MONGODB_URI: string = process.env.MONGODB_URI || "";

app.use(
  cors({
    origin: ["https://bcs.co.com", "https://holding-bcs.com"],
  })
);

app.use(express.json());

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to the MongoDb");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err.message);
  });
// const MYSQL_URI: string =
//   "mysql://root:NxsDmKkqqWc3OxcFwql2j5mw@grace.iran.liara.ir:34795/stoic_knuth";
// const connection = mysql.createConnection({
//   host: "192.168.1.85",
//   port: 3306,
//   user: "root",
//   password: "1",
//   database: "bitnami_pm",
// });

// connection.connect((err) => {
//   if (err) {
//     console.error("Error connecting to MySQL:", err);
//     return;
//   }
//   console.log("Connected to MySQL server");
// });

app.use("/api/users", userRouter);
app.use("/api/news", newsRouter);
app.use("/api/products", productRouter);
app.use("/api/forms", formsRouter);
app.use("/newsPhotos", express.static(path.join(__dirname, "mainBlogPhoto")));
app.use("/newsPhotosSub", express.static(path.join(__dirname, "blogPhotos")));
app.use(
  "/productFile",
  express.static(path.join(__dirname, "mainProductPDFFile"))
);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
