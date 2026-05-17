import { FiDroplet, FiZap, FiShield, FiUsers } from "react-icons/fi";

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="font-display text-5xl font-black mb-4">
          About <span className="text-blood-500">BloodBridge</span>
        </h1>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          A real-time platform connecting blood donors with recipients based on
          blood group compatibility — because finding blood shouldn't be hard.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          {
            icon: FiZap,
            title: "Real-Time Notifications",
            desc: "When someone requests blood, only matching blood group donors are instantly notified — no spam, just targeted alerts.",
          },
          {
            icon: FiShield,
            title: "Secure & Private",
            desc: "Your data is protected with JWT authentication. Only you can manage your own blood requests.",
          },
          {
            icon: FiUsers,
            title: "Community-Driven",
            desc: "Built around a community of donors and recipients who believe in the power of giving.",
          },
          {
            icon: FiDroplet,
            title: "Blood Group Matching",
            desc: "Smart matching ensures only compatible donors receive notifications for each blood request.",
          },
        ].map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-blood-500/30 transition-colors"
          >
            <div className="w-10 h-10 bg-blood-500/10 rounded-xl flex items-center justify-center mb-4">
              <Icon className="text-blood-500" size={20} />
            </div>
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}