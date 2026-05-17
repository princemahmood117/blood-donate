import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";

import toast from "react-hot-toast";
import { FiDroplet } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function SignUp() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    bloodGroup: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.bloodGroup) return toast.error("Please select a blood group");
    setLoading(true);
    try {
      const { data } = await axios.post("/auth/register", form);
      login(data);
      toast.success("Account created! Welcome to BloodBridge 🩸");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blood-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiDroplet className="text-white" size={22} />
          </div>
          <h1 className="font-display text-3xl font-bold">Create Account</h1>
          <p className="text-white/50 text-sm mt-2">Join the BloodBridge community</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-white/60 mb-1 block">Full Name</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                placeholder="John Doe"
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
                placeholder="+880 1xxx-xxxxxx"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blood-500 transition-colors placeholder:text-white/20"
              />
            </div>
            <div>
              <label className="text-sm text-white/60 mb-1 block">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blood-500 transition-colors placeholder:text-white/20"
              />
            </div>
            <div>
              <label className="text-sm text-white/60 mb-1 block">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Min 6 characters"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blood-500 transition-colors placeholder:text-white/20"
              />
            </div>
            <div>
              <label className="text-sm text-white/60 mb-1 block">Blood Group</label>
              <div className="grid grid-cols-4 gap-2">
                {BLOOD_GROUPS.map((bg) => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setForm({ ...form, bloodGroup: bg })}
                    className={`py-2 rounded-xl text-sm font-semibold border transition-all ${
                      form.bloodGroup === bg
                        ? "bg-blood-500 border-blood-500 text-white"
                        : "bg-white/5 border-white/10 text-white/60 hover:border-blood-500/50"
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blood-500 hover:bg-blood-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors mt-2"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <p className="text-center text-sm text-white/40 mt-6">
            Already have an account?{" "}
            <Link to="/signin" className="text-blood-400 hover:text-blood-300">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}