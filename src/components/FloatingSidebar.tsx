
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain,
  Users, 
  MessageSquare, 
  BarChart3, 
  DollarSign, 
  Target, 
  Lightbulb, 
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Zap,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";

const sidebarItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "People & TeamOps", path: "/people/dashboard" },
  { icon: DollarSign, label: "Finance", path: "/finance/dashboard" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Lightbulb, label: "Innovation Hub", path: "/innovation-hub" },
  { icon: Zap, label: "PulseFlow", path: "/pulseflow" },
  { icon: Shield, label: "Admin", path: "/admin" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const FloatingSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-6 left-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="icon"
          className="w-12 h-12 rounded-full glass text-white border-white/20 hover:bg-white/20 shadow-2xl transition-all duration-300 hover:scale-110 purple-glow"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar Content */}
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-6 top-24 w-80 h-[calc(100vh-12rem)] glass-dark rounded-2xl border-white/20 shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold gradient-text">PulseOS</h2>
                    <p className="text-white/60 text-sm">Business OS</p>
                  </div>
                </div>
                
                {/* User Profile */}
                <div className="flex items-center gap-3 p-3 rounded-xl glass border border-white/10">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
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
              <div className="flex-1 p-6 overflow-y-auto">
                <nav className="space-y-2">
                  {sidebarItems.map((item, index) => {
                    const isActive = location.pathname === item.path || 
                      (item.path === "/people/dashboard" && location.pathname.startsWith("/people")) ||
                      (item.path === "/finance/dashboard" && location.pathname.startsWith("/finance"));
                    return (
                      <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${
                            isActive 
                              ? "bg-gradient-to-r from-purple-600/30 to-purple-800/30 text-white border border-purple-500/50" 
                              : "text-white/70 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <item.icon className={`w-5 h-5 transition-all duration-300 ${
                            isActive ? "text-white" : "group-hover:scale-110"
                          }`} />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/10">
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  className="w-full justify-start text-white/70 hover:text-white hover:bg-white/5"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Sign Out
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingSidebar;
