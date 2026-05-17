import express from "express";
import {
  createRequest,
  getMyRequests,
  getAllRequests,
  getRequestById,
  resolveRequest,
} from "../controllers/requestController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createRequest);
router.get("/my", protect, getMyRequests);
router.get("/all", protect, getAllRequests);
router.get("/:id", protect, getRequestById);
router.delete("/:id", protect, resolveRequest);

export default router;