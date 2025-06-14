
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, UserPlus, Calendar, MessageSquare, Heart, Settings, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navigationItems = [
  { icon: UserPlus, label: "Onboarding", path: "/people/onboarding" },
  { icon: Users, label: "Teams", path: "/people/teams" },
  { icon: Calendar, label: "Leave", path: "/people/leaves" },
  { icon: MessageSquare, label: "Feedback", path: "/people/feedback" },
  { icon: Heart, label: "Morale", path: "/people/morale" },
  { icon: User, label: "Profiles", path: "/people/profiles" },
  { icon: Settings, label: "Settings", path: "/people/settings" },
];

const PeopleLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="flex">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-64 min-h-screen bg-black/20 backdrop-blur-xl border-r border-white/10"
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-[#6F2DBD] to-[#A663CC] rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">People & TeamOps</h1>
                <p className="text-white/60 text-sm">HR Management</p>
              </div>
            </div>

            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group",
                      isActive 
                        ? "bg-[#6F2DBD]/30 text-white border border-[#6F2DBD]/50" 
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className={cn(
                      "w-5 h-5 transition-all duration-300",
                      isActive ? "text-white" : "group-hover:scale-110"
                    )} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PeopleLayout;
