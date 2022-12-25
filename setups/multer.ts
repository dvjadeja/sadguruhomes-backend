import multer from "multer";
import DatauriParser from "datauri/parser";
import path from "path";

const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single("image");
const parser = new DatauriParser();

/**
 * @description This function converts the buffer to data url
 * @param {Object} req containing the field object
 * @returns {String} The data url from the string buffer
 */

const dataUri = (req: any) =>
  parser.format(
    path.extname(req.file.originalname).toString(),
    req.file.buffer
  );

export { multerUploads, dataUri };
