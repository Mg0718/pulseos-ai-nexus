
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Wrench, 
  Plus, 
  Search, 
  Filter,
  MapPin,
  Calendar,
  DollarSign,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  Settings,
  QrCode
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import FloatingSidebar from "@/components/FloatingSidebar";
import { supabase } from "@/integrations/supabase/client";

const FieldOps = () => {
  const [assets, setAssets] = useState<any[]>([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchAssets();
    fetchMaintenanceLogs();
  }, []);

  const fetchAssets = async () => {
    const { data } = await supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setAssets(data);
  };

  const fetchMaintenanceLogs = async () => {
    const { data } = await supabase
      .from('maintenance_logs')
      .select('*, assets(*)')
      .order('created_at', { ascending: false });
    
    if (data) setMaintenanceLogs(data);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'maintenance': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'retired': return <AlertTriangle className="w-4 h-4 text-gray-500" />;
      case 'lost': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300';
      case 'maintenance': return 'bg-yellow-500/20 text-yellow-300';
      case 'retired': return 'bg-gray-500/20 text-gray-300';
      case 'lost': return 'bg-red-500/20 text-red-300';
      default: return 'bg-blue-500/20 text-blue-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hardware': return <Package className="w-5 h-5" />;
      case 'software': return <Settings className="w-5 h-5" />;
      case 'vehicle': return <MapPin className="w-5 h-5" />;
      default: return <Wrench className="w-5 h-5" />;
    }
  };

  const stats = [
    { label: "Total Assets", value: assets.length, icon: Package, color: "bg-blue-500" },
    { label: "Active", value: assets.filter(a => a.status === 'active').length, icon: CheckCircle, color: "bg-green-500" },
    { label: "In Maintenance", value: assets.filter(a => a.status === 'maintenance').length, icon: Clock, color: "bg-yellow-500" },
    { label: "Total Value", value: `$${assets.reduce((sum, a) => sum + (a.value || 0), 0).toLocaleString()}`, icon: DollarSign, color: "bg-purple-500" }
  ];

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.asset_tag.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <FloatingSidebar />
      
      <div className="pl-24 pr-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">MSP & FieldOps</h1>
              <p className="text-gray-400">Asset management and field operations dashboard</p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <QrCode className="w-4 h-4 mr-2" />
                Scan Asset
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Asset
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-300 text-sm">{stat.label}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search assets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white"
                  >
                    <option value="all" className="bg-slate-800">All Categories</option>
                    <option value="hardware" className="bg-slate-800">Hardware</option>
                    <option value="software" className="bg-slate-800">Software</option>
                    <option value="vehicle" className="bg-slate-800">Vehicle</option>
                    <option value="equipment" className="bg-slate-800">Equipment</option>
                  </select>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Assets Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredAssets.map((asset, index) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                        {getCategoryIcon(asset.category)}
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{asset.name}</CardTitle>
                        <p className="text-gray-400 text-sm">#{asset.asset_tag}</p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(asset.status)} border-0`}>
                      {asset.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300 text-sm capitalize">{asset.category}</span>
                    </div>
                    
                    {asset.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300 text-sm">{asset.location}</span>
                      </div>
                    )}
                    
                    {asset.value && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-purple-400" />
                        <span className="text-white font-medium">
                          ${asset.value.toLocaleString()}
                        </span>
                      </div>
                    )}

                    {asset.warranty_expiry && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-400" />
                        <span className="text-gray-300 text-sm">
                          Warranty: {new Date(asset.warranty_expiry).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {asset.assigned_to && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-300 text-sm">Assigned</span>
                      </div>
                    )}
                  </div>

                  {asset.manufacturer && asset.model && (
                    <div className="mb-4 p-3 bg-white/5 rounded-lg">
                      <p className="text-gray-400 text-xs">Device Info</p>
                      <p className="text-white text-sm">{asset.manufacturer} {asset.model}</p>
                      {asset.serial_number && (
                        <p className="text-gray-400 text-xs">S/N: {asset.serial_number}</p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                      <QrCode className="w-4 h-4 mr-2" />
                      QR Code
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <Wrench className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Maintenance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Recent Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceLogs.slice(0, 5).map((log, index) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-white text-sm">{log.description}</p>
                      <p className="text-gray-400 text-xs">
                        {log.assets?.name} • {new Date(log.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(log.status)} border-0 text-xs`}>
                      {log.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {filteredAssets.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No assets found</h3>
            <p className="text-gray-400 mb-6">Get started by adding your first asset</p>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Asset
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FieldOps;
