import express from "express";
import { Request, Response } from "express";

import cors from "cors";
import { config } from "dotenv";

import mongoose from "./setups/mongo";
import { handleSuccess } from "./utils/response.utils";

const db = mongoose.connection;
db.on("error", (err) => console.log(`Something went wrong!`, err));
db.once("open", function () {
  console.log(`We're Connected with DB`);
});

const app = express();
config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  handleSuccess(res, {
    message: "Express App: Sample App",
  });
});

app.listen(process.env.PORT, () =>
  console.log(`Server Up:${process.env.PORT}`)
);
