
// import React, { createContext, useContext, useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";
// import { useAuth } from "./AuthContext";


// const SocketContext = createContext(null);

// export const SocketProvider = ({ children }) => {
//   const { user } = useAuth();
//   const socketRef = useRef(null);
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     if (!user) {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         socketRef.current = null;
//       }
//       return;
//     }

//     const socket = io("http://localhost:5000");
//     socketRef.current = socket;

//     socket.emit("join_blood_group", user.bloodGroup);

//     socket.on("new_blood_request", ({ request }) => {
//       if (request.requester === user._id) return;

//       setNotifications((prev) => [
//         {
//           id: request._id,
//           message: `🩸 ${request.name} needs ${request.amount} of ${request.bloodGroup} blood in ${request.location}`,
//           request,
//           read: false,
//           time: new Date(),
//         },
//         ...prev,
//       ]);
//     });

//     socket.on("request_resolved", ({ requestId }) => {
//       setNotifications((prev) => prev.filter((n) => n.id !== requestId));
//     });

//     return () => {
//       socket.disconnect();
//       socketRef.current = null;
//     };
//   }, [user]);

//   const clearNotification = (id) => {
//     setNotifications((prev) => prev.filter((n) => n.id !== id));
//   };

//   const markAllRead = () => {
//     setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
//   };

//   // Expose a getSocket function instead of the ref value directly
//   const getSocket = () => socketRef.current;

//   return (
//     <SocketContext.Provider
//       value={{ getSocket, notifications, clearNotification, markAllRead }}
//     >
//       {children}
//     </SocketContext.Provider>
//   );
// };

// // eslint-disable-next-line react-refresh/only-export-components
// export const useSocket = () => useContext(SocketContext)






// ================ ANOTHER CODE =============== //

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [feedbackNotifications, setFeedbackNotifications] = useState([]);

  useEffect(() => {
    if (!user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const socket = io("http://localhost:5000");
    socketRef.current = socket;

    // Join personal room for targeted feedback notifications
    socket.emit("join_user", user._id);

    // Blood request notifications — all users get notified now
    socket.on("new_blood_request", ({ request }) => {
      // Don't notify the requester themselves
      if (request.requester === user._id) return;

      setNotifications((prev) => [
        {
          id: request._id,
          message: `🩸 ${request.name} needs ${request.amount} of ${request.bloodGroup} blood in ${request.location}`,
          request,
          read: false,
          time: new Date(),
        },
        ...prev,
      ]);
    });

    // Feedback notifications — only the requester gets this
    socket.on("new_feedback", ({ requestId, feedback }) => {
      setFeedbackNotifications((prev) => [
        {
          id: feedback._id,
          requestId,
          message: `💬 ${feedback.donorName} (${feedback.donorBloodGroup}) left feedback on your request`,
          feedback,
          read: false,
          time: new Date(),
        },
        ...prev,
      ]);
    });

    socket.on("request_resolved", ({ requestId }) => {
      setNotifications((prev) => prev.filter((n) => n.id !== requestId));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearFeedbackNotification = (id) => {
    setFeedbackNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getSocket = () => socketRef.current;

  return (
    <SocketContext.Provider
      value={{
        getSocket,
        notifications,
        clearNotification,
        markAllRead,
        feedbackNotifications,
        clearFeedbackNotification,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => useContext(SocketContext);