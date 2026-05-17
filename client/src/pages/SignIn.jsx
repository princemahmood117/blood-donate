import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";

import toast from "react-hot-toast";
import { FiDroplet } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/auth/login", form);
      login(data);
      toast.success(`Welcome back, ${data.fullName.split(" ")[0]}! 🩸`);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
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
          <h1 className="font-display text-3xl font-bold">Welcome Back</h1>
          <p className="text-white/50 text-sm mt-2">Sign in to your account</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Your password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blood-500 transition-colors placeholder:text-white/20"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blood-500 hover:bg-blood-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors mt-2"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p className="text-center text-sm text-white/40 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blood-400 hover:text-blood-300">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}