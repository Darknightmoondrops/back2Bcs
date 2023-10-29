import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Product } from "../models/product.model";
import ProductModel from "../models/product.model";
import fs from "fs";
import path from "path";
import multer from "multer";
import IndustryModel, { Industry } from "../models/category.model";
const productRouter = express.Router();
// Set up the disk storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempFolder = path.join(__dirname, "..", "mainProductPDFFile");
    if (!fs.existsSync(tempFolder)) {
      fs.mkdirSync(tempFolder);
    }
    cb(null, tempFolder);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
// Set up multer with disk storage engine
const upload = multer({ storage });
// Function to validate file type
function validateFile(filePath: string): boolean {
  // Check file type based on file extension
  const extname = path.extname(filePath);
  if (extname === ".pdf" || extname === ".png" || extname === ".jpg") {
    return true;
  }
  return false;
}

// POST (Industry):
productRouter.post("/category", async (req: Request, res: Response) => {
  // Type guard for req.files
  if (!req.files || !("image" in req.files)) {
  }
  const { name, name_persian, name_arabic } = req.body;
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      _id: string;
    };

    const existingIndustry = await IndustryModel.findOne({
      $or: [{ name }],
    });
    if (existingIndustry) {
      return res.status(400).json({ message: "Industry already exists!" });
    }
    const industry = new IndustryModel({
      name,
      name_persian,
      name_arabic,
    });
    const newIndustry = await industry.save();
    res.status(201).json({
      message: "industry created!",
    });
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
});
// GET(Industry):
productRouter.get("/categoryData", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  console.log(token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      _id: string;
    };
    const industries = await IndustryModel.find();
    const industryNames = industries.map((industry) => industry.name);
    res.status(200).json({ industryNames });
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
});
// DELETE(Industry):
productRouter.get(
  "/deleteCategory/:id",
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Find the industry by id
      const industry = await IndustryModel.findById(id);

      // Check if the industry exists
      if (!industry) {
        return res.status(404).json({ message: "Industry not found" });
      }

      // Delete the industry
      await (industry as Industry).deleteOne();

      res.status(200).json({ message: "Industry deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);
// POST(Product):
productRouter.post(
  "/productAdd",
  upload.fields([{ name: "dataSheet", maxCount: 1 }]),
  async (req: Request, res: Response) => {
    try {
      const {
        name,
        category,
        mainCategory,
        categoryType,
        industry,
        overView,
        overView_persian,
        overView_arabic,
        shortDisc,
        featureOne,
        featureTwo,
        featureThree,
        featureFour,
        featureFive,
        featureSix,
      } = req.body;
      // Type guard for req.files
      if (req.files === undefined) {
        return res.status(422).json({ msg: "req.files === undefined" });
      }
      const files = req.files;
      let dataSheetFile = " ";
      if ("dataSheet" in files) {
        const mainPdf = files.dataSheet;
        // Type guard for img
        dataSheetFile = mainPdf[0].originalname;
      }
      // Type guard for img
      const product: Product = new ProductModel({
        name,
        category,
        mainCategory,
        categoryType,
        industry,
        dataSheet: dataSheetFile,
        create_at: Date.now(),
        price: " ",
        amount: " ",
        inventoryStatus: " ",
        overView,
        overView_persian,
        overView_arabic,
        shortDisc,
        featureOne,
        featureTwo,
        featureThree,
        featureFour,
        featureFive,
        featureSix,
      });

      // const authHeader = req.headers.authorization;
      // if (!authHeader) {
      //     return res.status(401).json({ message: "Unauthorized" });
      // }

      // const token = authHeader.split(" ")[1];

      // Validate and move image file
      await product.save();
      res.status(201).json({ message: "product created!" });
    } catch (error) {
      res.status(401).json(error);
    }
  }
);
// GET(Product List):
productRouter.get("/productList", async (req: Request, res: Response) => {
  //   const authHeader = req.headers.authorization;
  //   if (!authHeader) {
  //     return res.status(401).json({ message: "Unauthorized" });
  //   }
  //   const token = authHeader.split(" ")[1];
  //   console.log(token);
  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
    //   _id: string;
    // };
    const products = await ProductModel.find();
    res.status(200).json({ products });
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
});
// GET A Product :
productRouter.get("/productList/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    // Find the news item by id
    const newsItem = await ProductModel.findById(id);

    if (newsItem) {
      res.status(200).json({ newsItem });
    } else {
      res.status(404).json({ error: "Product item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
// Search
productRouter.get("/Search", async (req, res) => {
  try {
    const codeName = req.query.name as string;
    const category = req.query.mainCategory as string;
    const industry = req.query.industry as string;
    const type = req.query.categoryType as string;

    const query: any = {
      name: { $regex: codeName, $options: "i" },
      mainCategory: category !== "none" ? category : { $exists: true },
      industry: industry !== "none" ? industry : { $exists: true },
      categoryType: type !== "none" ? type : { $exists: true },
    };

    const results: Product[] = await ProductModel.find(query);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error searching for products:", error);
    res.status(500).json({ error: "Error searching for products!" });
  }
});
// DELETE(Product):
// productRouter.delete(
//   "/deleteProduct/:id",
//   async (req: Request, res: Response) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const token = authHeader.split(" ")[1];

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
//         _id: string;
//       };

//       const productId = req.params.id;

//       // Find the product by ID
//       const product = await ProductModel.findById(productId);

//       if (!product) {
//         return res.status(404).json({ message: "Product not found" });
//       }

//       // Delete the product's PDF file
//       if (product.dataSheet) {
//         const pdfFilePath = path.join(
//           __dirname,
//           "..",
//           "mainProductPDFFile",
//           product.dataSheet
//         );
//         if (fs.existsSync(pdfFilePath)) {
//           fs.unlinkSync(pdfFilePath);
//           console.log("PDF file deleted:", pdfFilePath);
//         }
//       }

//       // Delete the product's image file
//       if (product.img) {
//         const imgFilePath = path.join(
//           __dirname,
//           "..",
//           "mainProductPhotos",
//           product.img
//         );
//         if (fs.existsSync(imgFilePath)) {
//           fs.unlinkSync(imgFilePath);
//           console.log("Image file deleted:", imgFilePath);
//         }
//       }

//       // Delete the product from the database
//       await ProductModel.findByIdAndDelete(productId);

//       res.status(200).json({ message: "Product deleted" });
//     } catch (error) {
//       res.status(401).json({ message: "Unauthorized" });
//     }
//   }
// );
// EDIT(Product):
// productRouter.put("/editProduct/:id", async (req: Request, res: Response) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
//       _id: string;
//     };

//     const productId = req.params.id;

//     // Find the product by ID
//     const product = await ProductModel.findById(productId);

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Update the product properties
//     const updatedProduct = {
//       name: req.body.title || product.name,
//       name_persian: req.body.title_persian || product.name_persian,
//       name_arabic: req.body.title_arabic || product.name_arabic,
//       category: req.body.category || product.category,
//       status: req.body.status || product.status,
//       overView: req.body.overView || product.overView,
//       overView_persian: req.body.overView_persian || product.overView_persian,
//       overView_arabic: req.body.overView_arabic || product.overView_arabic,
//     };

//     // Update the product in the database
//     await ProductModel.findByIdAndUpdate(productId, updatedProduct);

//     res.status(200).json({ message: "Product updated" });
//   } catch (error) {
//     res.status(401).json({ message: "Unauthorized" });
//   }
// });
export default productRouter;
