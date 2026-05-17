import { useEffect, useState } from "react";
import axios from "../utils/axios";
import toast from "react-hot-toast";
import { FiDroplet, FiMapPin, FiClock, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

export default function AllRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // const { socket } = useSocket();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await axios.get("/requests/all");
        setRequests(data);
      } catch {
        toast.error("Failed to load requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);


  // useEffect(() => {
  //   if (!socket) return;
  //   socket.on("new_blood_request", ({ request }) => {
  //     setRequests((prev) => [request, ...prev]);
  //   });
  //   socket.on("request_resolved", ({ requestId }) => {
  //     setRequests((prev) => prev.filter((r) => r._id !== requestId));
  //   });
  //   return () => {
  //     socket.off("new_blood_request");
  //     socket.off("request_resolved");
  //   };
  // }, [socket]);


const { getSocket } = useSocket();

useEffect(() => {
  const socket = getSocket();
  if (!socket) return;

  socket.on("new_blood_request", ({ request }) => {
    setRequests((prev) => [request, ...prev]);
  });
  socket.on("request_resolved", ({ requestId }) => {
    setRequests((prev) => prev.filter((r) => r._id !== requestId));
  });

  return () => {
    socket.off("new_blood_request");
    socket.off("request_resolved");
  };
}, []);



  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blood-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-3xl mx-auto">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-black">
          Active <span className="text-blood-500">Requests</span>
        </h1>
        <p className="text-white/50 text-sm mt-1">
          {requests.length} people need blood right now
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiDroplet className="text-white/20" size={28} />
          </div>
          <p className="text-white/40">No active blood requests at the moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              onClick={() => navigate(`/requests/${req._id}`)}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-blood-500/30 hover:bg-white/8 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blood-500/10 border border-blood-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-blood-400 font-bold">{req.bloodGroup}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{req.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-white/50 mt-1">
                      <span className="flex items-center gap-1">
                        <FiMapPin size={12} />
                        {req.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiDroplet size={12} />
                        {req.amount}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/30 mt-1">
                      <FiClock size={11} />
                      {new Date(req.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
                <FiArrowRight
                  size={18}
                  className="text-white/30 group-hover:text-blood-500 transition-colors"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}