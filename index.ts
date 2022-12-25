import express, { response } from "express";
import { Request, Response } from "express";
import path, { resolve } from "path";

import cors from "cors";
import { config } from "dotenv";

import mongoose from "./setups/mongo";
import { handleErrors, handleSuccess } from "./utils/response.utils";

import { registerAdminRoutes } from "./routes";
import { multerUploads, dataUri } from "./setups/multer";
import { cloudinaryConfig, cloudinary } from "./setups/cloudinaryConfig";

const db = mongoose.connection;
db.on("error", (err) => console.log(`Something went wrong!`, err));
db.once("open", function () {
  console.log(`We're Connected with DB`);
});

const app = express();
config();

app.use(express.static(resolve(__dirname, "src/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("*", cloudinaryConfig);

registerAdminRoutes(app);

app.post(
  "/api/v1/admin/upload",
  multerUploads,
  async (req: Request, res: Response) => {
    try {
      if (req.file) {
        const file: any = dataUri(req).content;

        return cloudinary.uploader
          .upload(file)
          .then((result) => {
            const image = result;

            handleSuccess(res, {
              message: "Image uploaded successfully",
              data: image,
            });

            // return res.status(200).json({
            //   message: "Your Image has been uploaded successfully",
            //   data: {
            //     image,
            //   },
            // });
          })
          .catch((err) => {
            res.status(400).json({
              messge: "someting went wrong while processing your request",
              data: {
                err,
              },
            });
          });
      }
    } catch (error) {}
  }
);

app.post("/api/v1/admin/destroy", async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    console.log("PUBLIC_ID :: ", path.parse(url).name);
    cloudinary.uploader.destroy(
      path.parse(url).name,
      function (error: any, result: any) {
        console.log("Response :: ", result, "Error :: ", error);
        if (result.result === "ok") {
          handleSuccess(res, {
            status: 200,
            message: "Successfully Deleted Image",
          });
        }

        if (error) {
          return;
        }
      }
    );
  } catch (error) {
    handleErrors(req, res, {
      status: 500,
      message: "Error while Deleting Image",
      error,
    });
  }
});

app.get("/", (req: Request, res: Response) => {
  handleSuccess(res, {
    message: "Express App: Sample App",
  });
});

app.listen(process.env.PORT, () =>
  console.log(`Server Up:${process.env.PORT}`)
);
