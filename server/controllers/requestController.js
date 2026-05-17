// import BloodRequest from "../models/BloodRequest.js";

// // @desc   Create a blood request
// export const createRequest = async (req, res) => {
//   const { name, phone, location, bloodGroup, amount } = req.body;

//   try {
//     const request = await BloodRequest.create({
//       requester: req.user._id,
//       name,
//       phone,
//       location,
//       bloodGroup,
//       amount,
//     });

//     // Emit socket event — handled in server.js
//     // req.io.emit("new_blood_request", {
//     //   bloodGroup: request.bloodGroup,
//     //   request,
//     // });

//     req.io.to(request.bloodGroup).emit("new_blood_request", { request });

//     res.status(201).json(request);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc   Get logged-in user's requests
// export const getMyRequests = async (req, res) => {
//   try {
//     const requests = await BloodRequest.find({ requester: req.user._id }).sort({
//       createdAt: -1,
//     });
//     res.json(requests);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc   Get all active requests (for donors)
// export const getAllRequests = async (req, res) => {
//   try {
//     const requests = await BloodRequest.find({ status: "active" }).sort({
//       createdAt: -1,
//     });
//     res.json(requests);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc   Get single request detail
// export const getRequestById = async (req, res) => {
//   try {
//     const request = await BloodRequest.findById(req.params.id);
//     if (!request) return res.status(404).json({ message: "Request not found" });
//     res.json(request);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc   Mark request as resolved (delete)
// export const resolveRequest = async (req, res) => {
//   try {
//     const request = await BloodRequest.findById(req.params.id);
//     if (!request) return res.status(404).json({ message: "Request not found" });

//     if (request.requester.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     await BloodRequest.findByIdAndDelete(req.params.id);

//     // Notify all clients the request is resolved
//     // req.io.emit("request_resolved", { requestId: req.params.id });
    
//     req.io.emit("request_resolved", { requestId: req.params.id }); // broadcast to all — everyone removes it

//     res.json({ message: "Request resolved and deleted" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };









import BloodRequest from "../models/BloodRequest.js";

export const createRequest = async (req, res) => {
  const { name, phone, location, bloodGroup, amount } = req.body;

  try {
    const request = await BloodRequest.create({
      requester: req.user._id,
      name,
      phone,
      location,
      bloodGroup,
      amount,
    });

    // Broadcast to ALL connected users (not just matching blood group)
    req.io.emit("new_blood_request", { request });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find({ requester: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find({ status: "active" }).sort({
      createdAt: -1,
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRequestById = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resolveRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.requester.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await BloodRequest.findByIdAndDelete(req.params.id);

    // Broadcast to everyone that this request is gone
    req.io.emit("request_resolved", { requestId: req.params.id });

    res.json({ message: "Request resolved and deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};