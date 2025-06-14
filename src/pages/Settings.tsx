
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette,
  Globe,
  CreditCard,
  Key
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ShellLayout from "@/components/layouts/ShellLayout";
import { useAuth } from "@/contexts/AuthContext";

const Settings = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });

  const settingsSections = [
    {
      id: "profile",
      title: "Profile Settings",
      icon: User,
      description: "Manage your personal information"
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: Bell,
      description: "Configure your notification preferences"
    },
    {
      id: "security",
      title: "Security & Privacy",
      icon: Shield,
      description: "Manage your account security"
    },
    {
      id: "appearance",
      title: "Appearance",
      icon: Palette,
      description: "Customize your interface"
    },
    {
      id: "billing",
      title: "Billing & Plans",
      icon: CreditCard,
      description: "Manage your subscription"
    },
    {
      id: "integrations",
      title: "Integrations",
      icon: Globe,
      description: "Connect external services"
    }
  ];

  const [activeSection, setActiveSection] = useState("profile");

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <Avatar className="w-20 h-20">
          <AvatarImage src={user?.user_metadata?.avatar_url} />
          <AvatarFallback className="bg-[#6F2DBD] text-white text-xl">
            {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <Button variant="ghost" className="text-white border border-white/20 hover:bg-white/10">
            Change Avatar
          </Button>
          <p className="text-white/60 text-sm mt-2">JPG, PNG or GIF. Max size 2MB.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-white">Full Name</Label>
          <Input
            id="fullName"
            defaultValue={user?.user_metadata?.full_name || ""}
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">Email</Label>
          <Input
            id="email"
            defaultValue={user?.email || ""}
            className="bg-white/10 border-white/20 text-white"
            disabled
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title" className="text-white">Job Title</Label>
          <Input
            id="title"
            placeholder="e.g. Product Manager"
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department" className="text-white">Department</Label>
          <Input
            id="department"
            placeholder="e.g. Engineering"
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
      </div>
      
      <Button className="bg-white/20 hover:bg-white/30 text-white">
        Save Changes
      </Button>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="email-notifications" className="text-white">Email Notifications</Label>
            <p className="text-white/60 text-sm">Receive updates via email</p>
          </div>
          <Switch
            id="email-notifications"
            checked={notifications.email}
            onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="push-notifications" className="text-white">Push Notifications</Label>
            <p className="text-white/60 text-sm">Receive browser notifications</p>
          </div>
          <Switch
            id="push-notifications"
            checked={notifications.push}
            onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="sms-notifications" className="text-white">SMS Notifications</Label>
            <p className="text-white/60 text-sm">Receive text message alerts</p>
          </div>
          <Switch
            id="sms-notifications"
            checked={notifications.sms}
            onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
          />
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <Button variant="ghost" className="w-full justify-start text-white border border-white/20 hover:bg-white/10">
          <Key className="w-4 h-4 mr-2" />
          Change Password
        </Button>
        
        <Button variant="ghost" className="w-full justify-start text-white border border-white/20 hover:bg-white/10">
          <Shield className="w-4 h-4 mr-2" />
          Enable Two-Factor Authentication
        </Button>
        
        <div className="p-4 rounded-xl bg-yellow-500/20 border border-yellow-500/30">
          <h4 className="text-yellow-300 font-medium mb-2">Security Recommendation</h4>
          <p className="text-yellow-200 text-sm">
            Enable two-factor authentication to add an extra layer of security to your account.
          </p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return renderProfileSettings();
      case "notifications":
        return renderNotificationSettings();
      case "security":
        return renderSecuritySettings();
      case "appearance":
        return (
          <div className="text-center py-12">
            <Palette className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60">Appearance settings coming soon</p>
          </div>
        );
      case "billing":
        return (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60">Billing settings coming soon</p>
          </div>
        );
      case "integrations":
        return (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60">Integration settings coming soon</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ShellLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Settings</h1>
          </div>
          <p className="text-white/70">Manage your account and preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {settingsSections.map((section, index) => (
                    <motion.button
                      key={section.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-300 ${
                        activeSection === section.id
                          ? "bg-white/20 text-white border border-white/20"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <section.icon className="w-5 h-5" />
                      <div>
                        <p className="font-medium">{section.title}</p>
                        <p className="text-xs opacity-70">{section.description}</p>
                      </div>
                    </motion.button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </motion.div>

          {/* Settings Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">
                  {settingsSections.find(s => s.id === activeSection)?.title}
                </CardTitle>
                <CardDescription className="text-white/70">
                  {settingsSections.find(s => s.id === activeSection)?.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderContent()}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </ShellLayout>
  );
};

export default Settings;
