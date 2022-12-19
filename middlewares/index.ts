import { Request, Response } from "express";
import { handleErrors } from "../utils/response.utils";
import { verifyToken } from "../utils/auth.utils";

export const isAuthenticate = async (
  req: Request,
  res: Response,
  next: any
) => {
  const auth = req.headers.authorization;

  if (auth) {
    const token = auth.slice(7, auth.length);

    try {
      const decode = await verifyToken(token);

      console.log("Decoded token: ", decode);

      if (!decode) throw new Error("Unauthorized access");

      res.locals.user = { ...decode, userId: decode._id };

      next();
    } catch (error) {
      handleErrors(req, res, {
        status: 401,
        error,
      });
    }
  }
};

export const checkRole = (roles: any) => {
  return (req: Request, res: Response, next: any) => {
    const { role } = res.locals.user;

    try {
      if (!role) throw new Error("Unauthorized Access");

      if (!roles.includes(role)) throw new Error("Unauthorized Access");

      next();
    } catch (error) {
      handleErrors(req, res, {
        status: 401,
        message: "Error: Unauthroized Access",
        error,
      });
    }
  };
};
