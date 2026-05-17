// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
// import cors from "cors";
// import dotenv from "dotenv";
// import connectDB from "./config/db.js";
// import authRoutes from "./routes/authRoutes.js";
// import requestRoutes from "./routes/requestRoutes.js";

// dotenv.config();
// connectDB();

// const app = express();
// const httpServer = http.createServer(app);

// const io = new Server(httpServer, {
//   cors: {
//     origin: process.env.CLIENT_URL,
//     methods: ["GET", "POST"],
//   },
// });

// // Middleware
// app.use(cors({ origin: process.env.CLIENT_URL }));
// app.use(express.json());

// // Attach io to every request so controllers can emit events
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/requests", requestRoutes);

// // Socket.io connection
// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   // Client sends their blood group to join a room
//   socket.on("join_blood_group", (bloodGroup) => {
//     socket.join(bloodGroup);
//     console.log(`Socket ${socket.id} joined room: ${bloodGroup}`);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

// // Override the emit in requestController to target blood group rooms
// // We need to patch req.io.emit to use room-based emitting
// // We do this by extending io with a helper
// io.emitToBloodGroup = (bloodGroup, event, data) => {
//   io.to(bloodGroup).emit(event, data);
// };

// const PORT = process.env.PORT || 5000;
// httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));







import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";

dotenv.config();
connectDB();

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

// app.use(cors({ origin: process.env.CLIENT_URL, }));
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      "https://blood-donate-front.vercel.app",
      "https://socket.io/docs/v4/client-api",
      "https://socket.io",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/feedbacks", feedbackRoutes);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Each user joins a personal room using their userId
  // so we can send targeted notifications to the requester
  socket.on("join_user", (userId) => {
    socket.join(userId);
    console.log(`Socket ${socket.id} joined personal room: ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));