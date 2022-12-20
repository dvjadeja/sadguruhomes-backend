import express from "express";
import { Request, Response } from "express";

import cors from "cors";
import { config } from "dotenv";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";

import mongoose from "./setups/mongo";
import { handleErrors, handleSuccess } from "./utils/response.utils";

import { registerAdminRoutes } from "./routes";
import { checkRole, isAuthenticate } from "./middlewares";

const db = mongoose.connection;
db.on("error", (err) => console.log(`Something went wrong!`, err));
db.once("open", function () {
  console.log(`We're Connected with DB`);
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const app = express();
config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

registerAdminRoutes(app);

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.post("/api/v1/admin/upload", isAuthenticate, checkRole(["ADMIN"]), async (req: Request, res: Response) => {
  try {
    const file: any = req.files?.image;

    console.log("File :: ", file);

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
      folder: "Home",
    });

    console.log("Result :: ", result);
    handleSuccess(res, {
      message: "File Uploaded Successfully",
      data: result,
    });
  } catch (error) {
    handleErrors(req, res, {
      status: 500,
      message: "Error uploading file",
      error,
    });
  }
});

app.get('/api/v1/admin/destroy', isAuthenticate, checkRole(["ADMIN"]), async (req: Request, res: Response) => {
  try {
    const { public_id }: any = req.query

    const response = await cloudinary.uploader.destroy(public_id);

    console.log("Response :: ", response)
    handleSuccess(res, {
      message: "File Delete Successfully",
    })
  } catch (error) {
    handleErrors(req, res, {
      status: 500,
      message: "Error while Deleting Image",
      error
    })
  }
})

app.get("/", (req: Request, res: Response) => {
  handleSuccess(res, {
    message: "Express App: Sample App",
  });
});

app.listen(process.env.PORT, () =>
  console.log(`Server Up:${process.env.PORT}`)
);
