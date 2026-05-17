import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import NotificationDropdown from "./NotificationDropdown";
import { FiMenu, FiX, FiDroplet } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    ...(user
      ? [
          { label: "Request Blood", to: "/request-blood" },
          { label: "My Requests", to: "/my-requests" },
        ]
      : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50  bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blood-500 rounded-lg flex items-center justify-center group-hover:bg-blood-600 transition-colors">
              <FiDroplet className="text-white" size={16} />
            </div>
            <span className="font-display text-xl font-bold text-white">
              Blood<span className="text-blood-500">Bridge</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? "bg-blood-500/20 text-blood-400"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <NotificationDropdown />
                <div className="hidden md:flex items-center gap-3">
                  <span className="text-sm text-white/60">
                    {user.fullName.split(" ")[0]}
                  </span>
                  <span className="bg-blood-500/20 text-blood-400 text-xs font-bold px-2 py-1 rounded-full border border-blood-500/30">
                    {user.bloodGroup}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/signin"
                  className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blood-500 hover:bg-blood-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/10"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#111] border-t border-white/10 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                isActive(link.to)
                  ? "bg-blood-500/20 text-blood-400"
                  : "text-white/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={() => { handleLogout(); setMobileOpen(false); }}
              className="w-full cursor-pointer text-left px-4 py-2 text-sm text-white/50"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/signin" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-sm text-white/70">Sign In</Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="block px-4 py-2 bg-blood-500 text-white text-sm rounded-lg text-center">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}