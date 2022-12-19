import { Router } from "express";
import { loginAdmin, registerAdmin } from "../../controllers/admin/auth.controllers";

const router = Router();

router.post("/register", registerAdmin)

router.post("/login", loginAdmin)

export default router;
