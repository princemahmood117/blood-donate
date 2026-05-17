import { useState, useRef, useEffect } from "react";
import { FiBell } from "react-icons/fi";
import { useSocket } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const { notifications, markAllRead, clearNotification } = useSocket();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = () => {
    setOpen(!open);
    if (!open) markAllRead();
  };

  const handleNotificationClick = (notification) => {
    clearNotification(notification.id);
    setOpen(false);
    navigate(`/requests/${notification.id}`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
      >
        <FiBell size={22} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-blood-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <span className="font-semibold text-sm">Notifications</span>
            {notifications.length > 0 && (
              <button
                onClick={() => markAllRead()}
                className="text-xs text-blood-500 hover:text-blood-400"
              >
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-white/40 text-sm">
              No notifications yet
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 ${
                    !notif.read ? "bg-blood-500/5" : ""
                  }`}
                >
                  <p className="text-sm text-white/90 leading-snug">
                    {notif.message}
                  </p>
                  <p className="text-xs text-white/40 mt-1">
                    {new Date(notif.time).toLocaleTimeString()}
                  </p>
                </button>
              ))}
            </div>
          )}

          <div className="px-4 py-3 border-t border-white/10">
            <button
              onClick={() => {
                navigate("/all-requests");
                setOpen(false);
              }}
              className="w-full text-center text-sm text-blood-500 hover:text-blood-400 font-medium"
            >
              View all requests →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}