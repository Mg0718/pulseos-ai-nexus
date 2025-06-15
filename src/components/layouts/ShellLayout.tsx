
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  Search, 
  Settings,
  Calendar,
  CreditCard,
  Zap,
  Lightbulb,
  Users,
  Shield,
  Brain,
  LogOut,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";

const sidebarItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard", color: "text-blue-400" },
  { icon: Calendar, label: "Leave Management", path: "/leave", color: "text-green-400" },
  { icon: CreditCard, label: "PulsePay", path: "/pulsepay", color: "text-emerald-400" },
  { icon: Zap, label: "PulseFlow", path: "/pulseflow", color: "text-yellow-400" },
  { icon: Lightbulb, label: "Innovation Hub", path: "/innovation-hub", color: "text-purple-400" },
  { icon: Users, label: "Teams", path: "/teams", color: "text-cyan-400" },
  { icon: Settings, label: "Settings", path: "/settings", color: "text-gray-400" },
];

const adminItems = [
  { icon: Shield, label: "Admin Panel", path: "/admin", color: "text-red-400" },
];

interface ShellLayoutProps {
  children: React.ReactNode;
}

const ShellLayout = ({ children }: ShellLayoutProps) => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6F2DBD] via-[#A663CC] to-[#B298DC]">
      {/* Desktop Sidebar - Always visible */}
      <div className="fixed inset-y-0 left-0 z-50 w-80 overflow-y-auto">
        <div className="h-full bg-black/20 backdrop-blur-xl border-r border-white/10">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-[#6F2DBD] to-[#A663CC] rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">PulseOS</h2>
                <p className="text-white/60 text-sm">Business OS</p>
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-[#6F2DBD] text-white">
                  {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {user?.user_metadata?.full_name || "User"}
                </p>
                <p className="text-white/60 text-sm truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-6">
            <nav className="space-y-2">
              {sidebarItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${
                        isActive 
                          ? "bg-white/20 text-white border border-white/20" 
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? "text-white" : item.color} transition-all duration-300 group-hover:scale-110`} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </motion.div>
                );
              })}

              {/* Admin Section */}
              <div className="pt-4 mt-4 border-t border-white/10">
                <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">Admin</p>
                {adminItems.map((item, index) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (sidebarItems.length + index) * 0.05 }}
                    >
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${
                          isActive 
                            ? "bg-white/20 text-white border border-white/20" 
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <item.icon className={`w-5 h-5 ${isActive ? "text-white" : item.color} transition-all duration-300 group-hover:scale-110`} />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 mt-auto">
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-80">
        {/* Top Bar */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-white/10 bg-black/20 backdrop-blur-xl px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8"
        >
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center">
              <Search className="absolute left-3 w-4 h-4 text-white/60" />
              <input
                type="search"
                placeholder="Search PulseOS..."
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2 text-white placeholder:text-white/60 focus:border-white/40 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 p-0 text-[10px]">
                  3
                </Badge>
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ShellLayout;
