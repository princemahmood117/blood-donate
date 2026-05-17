// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "../utils/axios";
// import toast from "react-hot-toast";
// import {
//   FiDroplet,
//   FiMapPin,
//   FiPhone,
//   FiUser,
//   FiArrowLeft,
// } from "react-icons/fi";

// export default function RequestDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [request, setRequest] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchRequest = async () => {
//       try {
//         const { data } = await axios.get(`/requests/${id}`);
//         setRequest(data);
//       } catch {
//         toast.error("Request not found");
//         navigate("/all-requests");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRequest();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="min-h-screen pt-24 flex items-center justify-center">
//         <div className="w-8 h-8 border-2 border-blood-500 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   if (!request) return null;

//   return (
//     <div className="min-h-screen pt-24 pb-16 px-4 max-w-lg mx-auto">
//       <button
//         onClick={() => navigate(-1)}
//         className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors"
//       >
//         <FiArrowLeft size={16} />
//         Back
//       </button>

//       <div className="text-center mb-10">
//         <div className="w-20 h-20 bg-blood-500/10 border-2 border-blood-500/30 rounded-3xl flex items-center justify-center mx-auto mb-4">
//           <span className="text-blood-400 text-2xl font-black">
//             {request.bloodGroup}
//           </span>
//         </div>
//         <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-3 py-1 mb-3">
//           <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
//           <span className="text-red-400 text-xs font-medium">
//             Urgent Request
//           </span>
//         </div>
//         <h1 className="font-display text-3xl font-black">
//           Blood Request Details
//         </h1>
//       </div>

//       <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
//         {[
//           { icon: FiUser, label: "Patient Name", value: request.name },
//           { icon: FiPhone, label: "Contact Number", value: request.phone },
//           { icon: FiMapPin, label: "Location", value: request.location },
//           { icon: FiDroplet, label: "Blood Group", value: request.bloodGroup },
//           { icon: FiDroplet, label: "Amount Needed", value: request.amount },
//         ].map(({ icon: Icon, label, value }) => (
//           <div
//             key={label}
//             className="flex items-center gap-4 p-4 bg-white/5 rounded-xl"
//           >
//             <div className="w-10 h-10 bg-blood-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
//               <Icon className="text-blood-500" size={18} />
//             </div>
//             <div>
//               <p className="text-white/40 text-xs mb-0.5">{label}</p>
//               <p className="font-medium">{value}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="mt-6 p-5 bg-blood-500/5 border border-blood-500/20 rounded-2xl">
//         <p className="text-blood-400 text-sm font-medium mb-1">
//           Ready to donate?
//         </p>
//         <p className="text-white/50 text-sm">
//           Contact the patient directly at href={`tel:${request.phone}`}
//           className="text-blood-400 underline underline-offset-2"
//           <a>{request.phone}</a> to coordinate the donation. Every bag counts.
//           🩸
//         </p>
//       </div>

//       <p className="text-center text-white/30 text-xs mt-8">
//         Requested on{" "}
//         {new Date(request.createdAt).toLocaleDateString("en-US", {
//           weekday: "long",
//           year: "numeric",
//           month: "long",
//           day: "numeric",
//         })}
//       </p>
//     </div>
//   );
// }









import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import {
  FiDroplet,
  FiMapPin,
  FiPhone,
  FiUser,
  FiArrowLeft,
  FiSend,
  FiMessageSquare,
} from "react-icons/fi";

export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const isOwner = request?.requester === user?._id ||
    request?.requester?._id === user?._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, fbRes] = await Promise.all([
          axios.get(`/requests/${id}`),
          axios.get(`/feedbacks/${id}`),
        ]);
        setRequest(reqRes.data);
        setFeedbacks(fbRes.data);
      } catch {
        toast.error("Request not found");
        navigate("/all-requests");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleFeedbackSubmit = async () => {
    if (!message.trim()) return toast.error("Please write a message first");
    setSubmitting(true);
    try {
      const { data } = await axios.post(`/feedbacks/${id}`, { message });
      setFeedbacks((prev) => [data, ...prev]);
      setMessage("");
      toast.success("Feedback sent to the requester!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send feedback");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blood-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!request) return null;

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 max-w-lg mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-3 transition-colors"
      >
        <FiArrowLeft size={16} />
        Back
      </button>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-blood-500/10 border-2 border-blood-500/30 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <span className="text-blood-400 text-2xl font-black">
            {request.bloodGroup}
          </span>
        </div>
        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-3 py-1 mb-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-400 text-xs font-medium">Urgent Request</span>
        </div>
        <h1 className="font-display text-3xl font-black">Blood Request Details</h1>
      </div>

      {/* Details */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 mb-6">
        {[
          { icon: FiUser, label: "Patient Name", value: request.name },
          { icon: FiPhone, label: "Contact Number", value: request.phone },
          { icon: FiMapPin, label: "Location", value: request.location },
          { icon: FiDroplet, label: "Blood Group", value: request.bloodGroup },
          { icon: FiDroplet, label: "Amount Needed", value: request.amount },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
            <div className="w-10 h-10 bg-blood-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon className="text-blood-500" size={18} />
            </div>
            <div>
              <p className="text-white/40 text-xs mb-0.5">{label}</p>
              <p className="font-medium">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Contact tip — only for non-owners */}
      {!isOwner && (
        <div className="mb-6 p-5 bg-blood-500/5 border border-blood-500/20 rounded-2xl">
          <p className="text-blood-400 text-sm font-medium mb-1">Ready to donate?</p>
          <p className="text-white/50 text-sm">
            Contact the patient directly at{" "}
            <a href={`tel:${request.phone}`} className="text-blood-400 underline underline-offset-2">
              {request.phone}
            </a>{" "}
            to coordinate the donation. Every bag counts. 🩸
          </p>
        </div>
      )}

      {/* Feedback Box — hidden from the request owner */}
      {!isOwner && (
        <div className="mb-6 bg-white/5 border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiMessageSquare className="text-blood-500" size={18} />
            <h2 className="font-semibold text-base">Leave a Message</h2>
          </div>
          <p className="text-white/40 text-xs mb-4">
            Reponse for donation with your details (ex: phone number or message) or Can't donate but know someone who can? Write any helpful info for the requester.
          </p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder={`e.g. "I know someone with ${request.bloodGroup} — their number is 01xxx-xxxxxx"`}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blood-500 transition-colors placeholder:text-white/20 resize-none mb-3"
          />
          <button
            onClick={handleFeedbackSubmit}
            disabled={submitting}
            className="flex cursor-pointer items-center gap-2 px-5 py-2.5 bg-blood-500 hover:bg-blood-600 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <FiSend size={14} />
            {submitting ? "Sending..." : "Send Message"}
          </button>
        </div>
      )}

      {/* Feedbacks list — visible to everyone */}
      {feedbacks.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiMessageSquare className="text-blood-500" size={18} />
            <h2 className="font-semibold text-base">
              Messages ({feedbacks.length})
            </h2>
          </div>
          <div className="space-y-3">
            {feedbacks.map((fb) => (
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
                <p className="text-white/70 text-sm leading-relaxed">{fb.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-center text-white/30 text-xs mt-8">
        Requested on{" "}
        {new Date(request.createdAt).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </div>
  );
}