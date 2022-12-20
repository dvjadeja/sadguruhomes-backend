import { Express } from "express";

import AdminAuthRoutes from "./admin/auth.routes";

export const registerAdminRoutes = (app: Express) => {
  app.use("/api/v1/admin/auth", AdminAuthRoutes);
};
