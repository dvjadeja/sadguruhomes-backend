import { Request, Response } from "express";
import {
  generateHash,
  generateToken,
  verifyHash,
} from "../../utils/auth.utils";
import { handleErrors, handleSuccess } from "../../utils/response.utils";

import { Admin } from "../../models";

export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, password } = req.body;

    if (!phone) throw new Error("Phone cannot be empty");
    if (!password) throw new Error("Password cannot be empty");

    const user = await Admin.findOne({ phone });
    if (user) {
      throw new Error("A User with provided Phone number already exists");
    }

    const newAdmin = new Admin({
      name: name,
      phone: phone,
      email: email,
      password: await generateHash(password),
    });

    const registeredUser = await newAdmin.save();

    if (registeredUser) {
      const token = await generateToken({
        phone: registeredUser.phone,
        email: registeredUser.email,
        role: "ADMIN",
        _id: registeredUser._id,
      });

      handleSuccess(res, {
        message: "Admin Created Succesfully",
        data: {
          accessToken: token,
          user: registeredUser,
        },
      });
    }
  } catch (error) {
    handleErrors(req, res, {
      status: 500,
      message: "Error While Creating Admin",
      error,
    });
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;

    if (!phone) throw new Error("Phone No cannot be empty");
    if (!password) throw new Error("Password cannot be empty.");

    const admin = await Admin.findOne({ phone });

    if (!admin) {
      throw new Error(`Admin Does Not Exist`);
    }

    if (!(await verifyHash(password, `${admin.password}`)))
      throw new Error("Incorrect Password");

    const token = await generateToken({
      phone: admin.phone,
      email: admin.email,
      role: "ADMIN",
      _id: admin._id,
    });

    handleSuccess(res, {
      message: "Admin Logged in Succesfully",
      data: {
        accesToken: token,
      },
    });
  } catch (error) {
    handleErrors(req, res, {
      status: 500,
      message: "Error while Login Admin",
      error,
    });
  }
};
