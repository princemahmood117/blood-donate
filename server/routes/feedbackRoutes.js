import express from "express";
import {
  postFeedback,
  getFeedbacksForRequest,
  markFeedbacksRead,
} from "../controllers/feedbackController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:requestId", protect, postFeedback);
router.get("/:requestId", protect, getFeedbacksForRequest);
router.patch("/:requestId/read", protect, markFeedbacksRead);

export default router;