
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Lightbulb, 
  Plus, 
  ThumbsUp, 
  MessageCircle,
  Star,
  TrendingUp,
  Users,
  Award
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ShellLayout from "@/components/layouts/ShellLayout";

const ideas = [
  {
    id: 1,
    title: "AI-Powered Code Review Assistant",
    description: "Implement an AI system that automatically reviews code commits and suggests improvements based on best practices.",
    author: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b056f02",
    votes: 24,
    comments: 8,
    status: "in-review",
    category: "Development",
    createdAt: "2 days ago"
  },
  {
    id: 2,
    title: "Smart Meeting Room Booking",
    description: "Integrate IoT sensors with calendar systems to automatically optimize meeting room usage and prevent double bookings.",
    author: "Marcus Johnson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    votes: 18,
    comments: 12,
    status: "approved",
    category: "Operations",
    createdAt: "5 days ago"
  },
  {
    id: 3,
    title: "Employee Wellness Dashboard",
    description: "Create a comprehensive dashboard that tracks employee wellness metrics and provides personalized health recommendations.",
    author: "Elena Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    votes: 31,
    comments: 15,
    status: "implemented",
    category: "HR",
    createdAt: "1 week ago"
  },
];

const stats = [
  { label: "Total Ideas", value: "127", trend: "+12", icon: Lightbulb, color: "text-yellow-400" },
  { label: "Implemented", value: "34", trend: "+8", icon: Award, color: "text-green-400" },
  { label: "Active Contributors", value: "89", trend: "+15", icon: Users, color: "text-blue-400" },
  { label: "This Month", value: "23", trend: "+7", icon: TrendingUp, color: "text-purple-400" },
];

const InnovationHub = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "implemented":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "approved":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "in-review":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "submitted":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Development":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "Operations":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
      case "HR":
        return "bg-pink-500/20 text-pink-300 border-pink-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Innovation Hub</h1>
              <p className="text-white/70">Collaborate on ideas and drive innovation forward</p>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" className="text-white border border-white/20 hover:bg-white/10">
                <TrendingUp className="w-4 h-4 mr-2" />
                Trending
              </Button>
              <Button variant="ghost" className="text-white border border-white/20 hover:bg-white/10">
                <Star className="w-4 h-4 mr-2" />
                My Ideas
              </Button>
              <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
                <Plus className="w-4 h-4 mr-2" />
                Submit Idea
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/70 text-sm mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-green-400 text-sm">{stat.trend}</p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Ideas Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Innovation Ideas
              </CardTitle>
              <CardDescription className="text-white/70">
                Explore and vote on community-driven innovations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {ideas.map((idea, index) => (
                  <motion.div
                    key={idea.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10"
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={idea.avatar} />
                        <AvatarFallback className="bg-[#6F2DBD] text-white">
                          {idea.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-white">{idea.title}</h3>
                          <Badge className={getStatusColor(idea.status)}>
                            {idea.status}
                          </Badge>
                          <Badge className={getCategoryColor(idea.category)}>
                            {idea.category}
                          </Badge>
                        </div>
                        
                        <p className="text-white/80 mb-4 leading-relaxed">{idea.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-white/60">
                            <span>by {idea.author}</span>
                            <span>{idea.createdAt}</span>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                              <ThumbsUp className="w-4 h-4 mr-2" />
                              {idea.votes}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              {idea.comments}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ShellLayout>
  );
};

export default InnovationHub;
