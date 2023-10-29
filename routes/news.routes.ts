import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import NewsModel, { News } from "../models/news.model";
import moment from "moment";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
const newsRouter = express.Router();
// Set up the disk storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "mainPic") {
      const mainPhotoFolder = path.join(__dirname, "..", "mainBlogPhoto");
      if (!fs.existsSync(mainPhotoFolder)) {
        fs.mkdirSync(mainPhotoFolder);
      }
      return cb(null, mainPhotoFolder);
    }
    if (file.fieldname === "pics") {
      const photosFolder = path.join(__dirname, "..", "blogPhotos");
      if (!fs.existsSync(photosFolder)) {
        fs.mkdirSync(photosFolder);
      }
      return cb(null, photosFolder);
    }
  },
  filename: (req, file, cb) => {
    if (file.fieldname === "mainPic") {
      const uniqueId = uuidv4();
      const randomNum = Math.floor(Math.random() * 100000);
      const mainImgFile = `mainPic_${Date.now()}_${uniqueId}_${randomNum}.jpg`;
      return cb(null, mainImgFile);
    }
    if (file.fieldname === "pics") {
      const uniqueId = uuidv4();
      const randomNum1 = Math.floor(Math.random() * 100000);
      const picsFile = `pic_${Date.now()}_${uniqueId}_${randomNum1}.jpg`;
      return cb(null, picsFile);
    }
  },
});
// Set up multer with disk storage engine
const upload = multer({ storage });
// Function to validate file type
function validateFile(filePath: string): boolean {
  // Check file type based on file extension
  const extname = path.extname(filePath);
  if (extname === ".jpeg" || extname === ".png" || extname === ".jpg") {
    return true;
  }
  return false;
}
interface FileFields {
  [fieldname: string]: File[];
}
newsRouter.post(
  "/addNews",
  upload.fields([
    { name: "mainPic", maxCount: 1 },
    { name: "pics", maxCount: 10 },
  ]),
  async (req: Request, res: Response) => {
    try {
      const {
        title,
        titleFa,
        titleAr,
        fullText,
        fullTextFa,
        fullTextAr,
        category,
        categoryFa,
        categoryAr,
      } = req.body;
      // Type guard for req.files
      if (req.files === undefined) {
        return res.status(422).json({ msg: "req.files === undefined" });
      }
      const files = req.files;
      if (!("mainPic" in files)) {
        return res.status(422).json({ msg: "mainPic in files" });
      }
      const mainPic = files.mainPic;
      const pics = files.pics;
      // Type guard for img
      const mainImgFile = mainPic[0].filename;
      const RPics = pics.map((pic) => pic.filename);
      const news: News = new NewsModel({
        title,
        titleFa,
        titleAr,
        category,
        categoryFa,
        categoryAr,
        fullText,
        fullTextFa,
        fullTextAr,
        create_at: Date.now(),
        mainPic: mainImgFile,
        pics: RPics,
      });
      // const authHeader = req.headers.authorization;
      // if (!authHeader) {
      //     return res.status(401).json({ message: "Unauthorized" });
      // }
      // const token = authHeader.split(" ")[1];

      await news.save();
      res.status(201).json("news added!");
    } catch (error) {
      res.status(401).json(error);
    }
  }
);
// GET News :
newsRouter.get("/newsData", async (req: Request, res: Response) => {
  try {
    const newsData = await NewsModel.find({ isDelete: false }).sort({
      _id: -1,
    });
    res.status(200).json({ newsData });
  } catch (error) {
    res.status(401).json(error);
  }
});
// GET A NEWS
newsRouter.get("/newsData/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    // Find the news item by id
    const newsItem = await NewsModel.findById(id);

    if (newsItem) {
      res.status(200).json({ newsItem });
    } else {
      res.status(404).json({ error: "News item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
// Get 3 news :
newsRouter.get("/mainNews", async (req: Request, res: Response) => {
  try {
    const news = await NewsModel.find().sort({ _id: -1 }).limit(3);
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ error: "خطا در دریافت اخبار" });
  }
});
export default newsRouter;
