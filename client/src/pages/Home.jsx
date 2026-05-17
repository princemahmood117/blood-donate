
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiDroplet, FiHeart, FiUsers } from "react-icons/fi";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleNeedBlood = () => {
    if (user) navigate("/request-blood");
    else navigate("/signin");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#150008] to-[#0a0a0a]" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blood-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blood-700/30 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(225,29,72,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(225,29,72,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blood-500/10 border border-blood-500/30 rounded-full px-4 py-2 mb-8">
            <FiDroplet className="text-blood-500" size={14} />
            <span className="text-blood-400 text-sm font-medium">
              Real-time Blood Donation Network
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl font-black leading-tight mb-6">
            Every Drop
            <br />
            <span className="text-blood-500">Saves a Life</span>
          </h1>

          <p className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Connect blood donors with those in need instantly. When seconds
            count, BloodBridge brings the right help to the right person.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleNeedBlood}
              className="group cursor-pointer px-8 py-4 bg-blood-500 hover:bg-blood-600 text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-blood-500/30 hover:scale-105 flex items-center justify-center gap-2"
            >
              <FiDroplet size={18} />
              Need Blood?
            </button>
            <button
              onClick={() => navigate(user ? "/all-requests" : "/signup")}
              className="px-8 cursor-pointer py-4 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-2xl border border-white/20 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <FiHeart size={18} />
              Donate Blood
            </button>
          </div>
        </div>

        {/* Scroll indicator — fixed positioning inside hero */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center pt-2">
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: FiDroplet, label: "Blood Groups Covered", value: "8" },
            { icon: FiUsers, label: "Lives Connected", value: "∞" },
            { icon: FiHeart, label: "Real-time Alerts", value: "24/7" },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-blood-500/30 transition-colors"
            >
              <Icon className="text-blood-500 mx-auto mb-3" size={28} />
              <div className="font-display text-4xl font-bold mb-1">{value}</div>
              <div className="text-white/50 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}