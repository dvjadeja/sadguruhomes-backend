import { config } from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { NextFunction, Request, Response } from "express";

config();

const cloudinaryConfig = (req: Request, res: Response, next: NextFunction) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });

  next();
};

export { cloudinaryConfig, cloudinary };
