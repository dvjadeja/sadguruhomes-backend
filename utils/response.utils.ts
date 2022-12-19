import { AxiosError } from "axios";
import { Request, Response } from "express";

import { ZodError } from "zod";

type Res = {
  code?: string;
  status?: number;
  message?: string;
  data?: {
    [key: string]: any;
  };
};

type ErrRes = {
  code?: string;
  status?: number;
  message?: string;
  error: any;
};

export const handleSuccess = (res: Response, resObj: Res) => {
  const { status, ...rest } = resObj;

  return res.status(status || 200).json({
    code: resObj.code || "SUCCESS",
    ...rest,
  });
};

export const handleAxiosError = (error: AxiosError | any) => {
  if (!error.response) return null;

  const config = error.response?.config;

  console.log("\n\n\n ------------------------------- \n");
  console.log("Config Headers", config?.headers);
  console.log("Config Base URL", config?.baseURL);
  console.log("Config Endpoint", config?.url);
  console.log("Config Data", config?.headers);
  console.log("\n ------------------------------- \n\n\n");

  console.log("Data", error.response?.data);

  return { data: error.response?.data };
};

const handleZodErrors = (error: any) => {
  console.log("Zod Error", error);

  const data = error.issues.map(
    (err: any) =>
      `${err.path}: expected ${err.expected}, but recieved ${err.recieved}}`
  );

  console.log("Error", data);
};

export const handleErrors = (req: Request, res: Response, errObj: ErrRes) => {
  let _error = errObj?.error;

  if (_error instanceof AxiosError) _error = handleAxiosError(errObj.error);

  if (_error instanceof ZodError) _error = handleZodErrors(errObj.error);

  const { status, ...rest } = errObj;

  return res.status(status || 400).json({
    code: "ERROR",
    data: {
      message: _error?.message || _error,
      query: { ...req.query },
      body: { ...req.body },
      params: { ...req.params },
      data: _error?.data,
    },
    ...rest,
  });
};
