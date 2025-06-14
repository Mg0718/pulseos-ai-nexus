
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, UserPlus, Calendar, MessageSquare, Heart, Settings, User, Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

const navigationItems = [
  { icon: UserPlus, label: "Onboarding", path: "/people/onboarding", badge: 2 },
  { icon: Users, label: "Teams", path: "/people/teams", badge: null },
  { icon: Calendar, label: "Leave", path: "/people/leaves", badge: 3 },
  { icon: MessageSquare, label: "Feedback", path: "/people/feedback", badge: 1 },
  { icon: Heart, label: "Morale", path: "/people/morale", badge: null },
  { icon: User, label: "Profiles", path: "/people/profiles", badge: null },
  { icon: Settings, label: "Settings", path: "/people/settings", badge: null },
];

const PeopleLayout = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="flex">
        {/* Enhanced Sidebar */}
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-64 min-h-screen bg-black/20 backdrop-blur-xl border-r border-white/10"
        >
          <div className="p-6">
            {/* Header Section */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-[#6F2DBD] to-[#A663CC] rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">People & TeamOps</h1>
                <p className="text-white/60 text-sm">HR Management</p>
              </div>
            </div>

            {/* User Profile Section */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 mb-6">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-[#6F2DBD] text-white">
                  {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {user?.user_metadata?.full_name || 'User'}
                </p>
                <p className="text-white/60 text-xs truncate">HR Manager</p>
              </div>
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white p-1">
                <Bell className="w-4 h-4" />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center p-0">
                    {notifications}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group relative",
                      isActive 
                        ? "bg-[#6F2DBD]/30 text-white border border-[#6F2DBD]/50" 
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className={cn(
                      "w-5 h-5 transition-all duration-300",
                      isActive ? "text-white" : "group-hover:scale-110"
                    )} />
                    <span className="font-medium flex-1">{item.label}</span>
                    {item.badge && (
                      <Badge className="bg-red-500 text-white text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Quick Actions */}
            <div className="mt-8 space-y-2">
              <p className="text-white/50 text-xs uppercase tracking-wide font-semibold px-3">
                Quick Actions
              </p>
              <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/5">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
              <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/5">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Review
              </Button>
            </div>
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
