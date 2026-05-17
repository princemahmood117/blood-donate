import { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "../utils/axios";
import toast from "react-hot-toast";
import { FiDroplet } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function RequestBlood() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.fullName || "",
    phone: user?.phone || "",
    location: "",
    bloodGroup: "",
    amount: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.bloodGroup) return toast.error("Please select required blood group");
    setLoading(true);
    try {
      await axios.post("/requests", form);
      toast.success("Blood request sent! Donors are being notified 🩸");
      setTimeout(() => navigate("/my-requests"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-xl mx-auto">
      <div className="text-center mb-10">
        <div className="w-12 h-12 bg-blood-500/10 border border-blood-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FiDroplet className="text-blood-500" size={22} />
        </div>
        <h1 className="font-display text-4xl font-black mb-2">
          Request <span className="text-blood-500">Blood</span>
        </h1>
        <p className="text-white/50 text-sm">
          Fill in the details below. Matching donors will be notified instantly.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-white/60 mb-1 block">Your Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Full name of the patient"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blood-500 transition-colors placeholder:text-white/20"
            />
          </div>

          <div>
            <label className="text-sm text-white/60 mb-1 block">Phone Number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="Contact number for donors"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blood-500 transition-colors placeholder:text-white/20"
            />
          </div>

          <div>
            <label className="text-sm text-white/60 mb-1 block">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              placeholder="Hospital name, area, city"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blood-500 transition-colors placeholder:text-white/20"
            />
          </div>

          <div>
            <label className="text-sm text-white/60 mb-2 block">Required Blood Group</label>
            <div className="grid grid-cols-4 gap-2">
              {BLOOD_GROUPS.map((bg) => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => setForm({ ...form, bloodGroup: bg })}
                  className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${
                    form.bloodGroup === bg
                      ? "bg-blood-500 border-blood-500 text-white scale-105"
                      : "bg-white/5 border-white/10 text-white/60 hover:border-blood-500/50"
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-white/60 mb-1 block">Amount of Blood Needed</label>
            <input
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
              placeholder="e.g., 2 bags, 3 units"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blood-500 transition-colors placeholder:text-white/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer py-4 bg-blood-500 hover:bg-blood-600 disabled:opacity-50 text-white font-bold rounded-2xl transition-all hover:shadow-lg hover:shadow-blood-500/20 flex items-center justify-center gap-2 text-base"
          >
            <FiDroplet size={18} />
            {loading ? "Sending Request..." : "Request Now"}
          </button>
        </form>
      </div>
    </div>
  );
}