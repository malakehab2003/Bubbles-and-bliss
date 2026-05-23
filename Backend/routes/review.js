import express from "express";
import * as ReviewController from "../controller/reviewController.js";
import * as middleware from "../utils/middlewares.js";
import { upload } from "../utils/multer.js";

const router = express.Router();

router.get("/list", ReviewController.listReviews);
router.post("/create", middleware.AuthRequest, upload.single("image"), ReviewController.createReview);
router.put("/update/:id", middleware.AuthRequest, ReviewController.updateReview);
router.delete("/delete/:id", middleware.AuthRequest, ReviewController.deleteReview);

// Admin: delete any review
router.delete("/admin/delete/:id", middleware.AuthRequest, middleware.roleAuth(["admin"]), ReviewController.adminDeleteReview);

export default router;