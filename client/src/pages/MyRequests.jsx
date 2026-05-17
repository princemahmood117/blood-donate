
// import { useEffect, useState } from "react";
// import axios from "../utils/axios";
// import toast from "react-hot-toast";
// import { FiDroplet, FiMapPin, FiPhone, FiCheck, FiPlus } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import { useSocket } from "../context/SocketContext";

// export default function MyRequests() {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const { getSocket } = useSocket();

//   useEffect(() => {
//     const loadRequests = async () => {
//       try {
//         const { data } = await axios.get("/requests/my");
//         setRequests(data);
//       } catch {
//         toast.error("Failed to load requests");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadRequests();
//   }, []);

//   useEffect(() => {
//     const socket = getSocket();
//     if (!socket) return;

//     socket.on("request_resolved", ({ requestId }) => {
//       setRequests((prev) => prev.filter((r) => r._id !== requestId));
//     });

//     return () => socket.off("request_resolved");
//   }, []);

//   const handleResolve = async (id) => {
//     const confirmed = window.confirm(
//       "Mark this request as resolved? It will be permanently deleted."
//     );
//     if (!confirmed) return;
//     try {
//       await axios.delete(`/requests/${id}`);
//       setRequests((prev) => prev.filter((r) => r._id !== id));
//       toast.success("Request marked as resolved ✓");
//     } catch {
//       toast.error("Failed to resolve request");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen pt-24 flex items-center justify-center">
//         <div className="w-8 h-8 border-2 border-blood-500 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen pt-24 pb-16 px-4 max-w-3xl mx-auto">
//       <div className="flex items-center justify-between mb-10">
//         <div>
//           <h1 className="font-display text-4xl font-black">
//             My <span className="text-blood-500">Requests</span>
//           </h1>
//           <p className="text-white/50 text-sm mt-1">
//             {requests.length} active request{requests.length !== 1 ? "s" : ""}
//           </p>
//         </div>
//         <button
//           onClick={() => navigate("/request-blood")}
//           className="flex items-center gap-2 px-4 py-2 bg-blood-500 hover:bg-blood-600 rounded-xl text-sm font-medium transition-colors"
//         >
//           <FiPlus size={16} />
//           New Request
//         </button>
//       </div>

//       {requests.length === 0 ? (
//         <div className="text-center py-20">
//           <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
//             <FiDroplet className="text-white/20" size={28} />
//           </div>
//           <p className="text-white/40 mb-4">No active requests</p>
//           <button
//             onClick={() => navigate("/request-blood")}
//             className="px-6 py-3 bg-blood-500 hover:bg-blood-600 rounded-xl text-sm font-medium transition-colors"
//           >
//             Make a Request
//           </button>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {requests.map((req) => (
//             <div
//               key={req._id}
//               className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors"
//             >
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex items-center gap-3">
//                   <div className="w-12 h-12 bg-blood-500/10 border border-blood-500/30 rounded-xl flex items-center justify-center">
//                     <span className="text-blood-400 font-bold text-sm">
//                       {req.bloodGroup}
//                     </span>
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">{req.name}</h3>
//                     <p className="text-white/40 text-xs">
//                       {new Date(req.createdAt).toLocaleDateString("en-US", {
//                         month: "short",
//                         day: "numeric",
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </p>
//                   </div>
//                 </div>
//                 <span className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs px-3 py-1 rounded-full font-medium">
//                   Active
//                 </span>
//               </div>

//               <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-white/60">
//                 <div className="flex items-center gap-2">
//                   <FiMapPin size={14} className="text-blood-500" />
//                   {req.location}
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <FiPhone size={14} className="text-blood-500" />
//                   {req.phone}
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <FiDroplet size={14} className="text-blood-500" />
//                   {req.amount}
//                 </div>
//               </div>

//               <button
//                 onClick={() => handleResolve(req._id)}
//                 className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl text-sm font-medium transition-colors"
//               >
//                 <FiCheck size={15} />
//                 Mark as Resolved
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }






// ================ ANother code ============ //

import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import toast from "react-hot-toast";
import {
  FiDroplet, FiMapPin, FiPhone, FiCheck, FiPlus, FiMessageSquare, FiChevronDown, FiChevronUp,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [feedbackMap, setFeedbackMap] = useState({});
  const [expandedFeedbacks, setExpandedFeedbacks] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { getSocket, feedbackNotifications, clearFeedbackNotification } = useSocket();

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const { data } = await axios.get("/requests/my");
        setRequests(data);

        // Load feedbacks for each request
        const feedbackResults = await Promise.all(
          data.map((req) =>
            axios.get(`/feedbacks/${req._id}`).then((res) => ({
              id: req._id,
              feedbacks: res.data,
            }))
          )
        );

        const map = {};
        feedbackResults.forEach(({ id, feedbacks }) => {
          map[id] = feedbacks;
        });
        setFeedbackMap(map);
      } catch {
        toast.error("Failed to load requests");
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  // Real-time: append incoming feedback to the correct request
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("new_feedback", ({ requestId, feedback }) => {
      setFeedbackMap((prev) => ({
        ...prev,
        [requestId]: [feedback, ...(prev[requestId] || [])],
      }));
      // Auto-expand feedbacks for that request
      setExpandedFeedbacks((prev) => ({ ...prev, [requestId]: true }));
    });

    socket.on("request_resolved", ({ requestId }) => {
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
    });

    return () => {
      socket.off("new_feedback");
      socket.off("request_resolved");
    };
  }, []);

  const handleResolve = async (id) => {
    const confirmed = window.confirm(
      "Mark this request as resolved? It will be permanently deleted."
    );
    if (!confirmed) return;
    try {
      await axios.delete(`/requests/${id}`);
      setRequests((prev) => prev.filter((r) => r._id !== id));
      toast.success("Request marked as resolved ✓");
    } catch {
      toast.error("Failed to resolve request");
    }
  };

  const toggleFeedbacks = (id) => {
    setExpandedFeedbacks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blood-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-4xl font-black">
            My <span className="text-blood-500">Requests</span>
          </h1>
          <p className="text-white/50 text-sm mt-1">
            {requests.length} active request{requests.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => navigate("/request-blood")}
          className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-blood-500 hover:bg-blood-600 rounded-xl text-sm font-medium transition-colors"
        >
          <FiPlus size={16} />
          New Request
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiDroplet className="text-white/20" size={28} />
          </div>
          <p className="text-white/40 mb-4">No active requests</p>
          <button
            onClick={() => navigate("/request-blood")}
            className="px-6 py-3 cursor-pointer bg-blood-500 hover:bg-blood-600 rounded-xl text-sm font-medium transition-colors"
          >
            Make a Request
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((req) => {
            const reqFeedbacks = feedbackMap[req._id] || [];
            const unreadCount = feedbackNotifications.filter(
              (n) => n.requestId === req._id
            ).length;
            const isExpanded = expandedFeedbacks[req._id];

            return (
              <div
                key={req._id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors"
              >
                {/* Request Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blood-500/10 border border-blood-500/30 rounded-xl flex items-center justify-center">
                      <span className="text-blood-400 font-bold text-sm">
                        {req.bloodGroup}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{req.name}</h3>
                      <p className="text-white/40 text-xs">
                        {new Date(req.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs px-3 py-1 rounded-full font-medium">
                    Active
                  </span>
                </div>

                {/* Request Info */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <FiMapPin size={14} className="text-blood-500" />
                    {req.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone size={14} className="text-blood-500" />
                    {req.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <FiDroplet size={14} className="text-blood-500" />
                    {req.amount}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={() => handleResolve(req._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                  >
                    <FiCheck size={15} />
                    Mark as Resolved
                  </button>

                  {reqFeedbacks.length > 0 && (
                    <button
                      onClick={() => {
                        toggleFeedbacks(req._id);
                        // Clear feedback notifications for this request
                        feedbackNotifications
                          .filter((n) => n.requestId === req._id)
                          .forEach((n) => clearFeedbackNotification(n.id));
                      }}
                      className="relative flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 rounded-xl text-sm font-medium transition-colors"
                    >
                      <FiMessageSquare size={15} />
                      Messages ({reqFeedbacks.length})
                      {unreadCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-blood-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                          {unreadCount}
                        </span>
                      )}
                      {isExpanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                    </button>
                  )}
                </div>

                {/* Feedbacks Expandable Section */}
                {isExpanded && reqFeedbacks.length > 0 && (
                  <div className="border-t border-white/10 pt-4 space-y-3">
                    <p className="text-white/40 text-xs mb-3">
                      Messages from the community:
                    </p>
                    {reqFeedbacks.map((fb) => (
                      <div key={fb._id} className="bg-white/5 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{fb.donorName}</span>
                            <span className="bg-blood-500/10 text-blood-400 text-xs px-2 py-0.5 rounded-full border border-blood-500/20">
                              {fb.donorBloodGroup}
                            </span>
                          </div>
                          <span className="text-white/30 text-xs">
                            {new Date(fb.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-white/70 text-sm leading-relaxed">
                          {fb.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}