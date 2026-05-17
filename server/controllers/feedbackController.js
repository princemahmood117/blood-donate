import Feedback from "../models/Feedback.js";
import BloodRequest from "../models/BloodRequest.js";

// Post a feedback on a request
export const postFeedback = async (req, res) => {
  const { message } = req.body;
  const { requestId } = req.params;

  try {
    const request = await BloodRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    // Prevent the requester from leaving feedback on their own request
    if (request.requester.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot leave feedback on your own request" });
    }

    const feedback = await Feedback.create({
      request: requestId,
      requester: request.requester,
      donor: req.user._id,
      donorName: req.user.fullName,
      donorBloodGroup: req.user.bloodGroup,
      message,
    });

    // Notify the requester personally via their socket room
    req.io.to(request.requester.toString()).emit("new_feedback", {
      requestId,
      feedback,
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all feedbacks for a specific request
export const getFeedbacksForRequest = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ request: req.params.requestId }).sort({
      createdAt: -1,
    });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark feedbacks as read for a request (called when requester opens MyRequests)
export const markFeedbacksRead = async (req, res) => {
  try {
    await Feedback.updateMany(
      { request: req.params.requestId, requester: req.user._id },
      { read: true }
    );
    res.json({ message: "Marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};