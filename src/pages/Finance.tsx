
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Calculator, CreditCard, BarChart3, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const Finance = () => {
  const financeModules = [
    {
      title: "Dashboard",
      description: "Financial overview and KPIs",
      icon: BarChart3,
      path: "/finance/dashboard",
      color: "from-[#6F2DBD] to-[#A663CC]"
    },
    {
      title: "Payroll",
      description: "Manage employee salaries and benefits",
      icon: Calculator,
      path: "/finance/payroll",
      color: "from-[#A663CC] to-[#B298DC]"
    },
    {
      title: "Invoices",
      description: "Create and track invoices",
      icon: DollarSign,
      path: "/finance/invoices",
      color: "from-[#B298DC] to-[#B9FAF8]"
    },
    {
      title: "Billing Models",
      description: "Configure pricing and plans",
      icon: CreditCard,
      path: "/finance/billing-models",
      color: "from-[#6F2DBD] to-[#B9FAF8]"
    },
    {
      title: "Transactions",
      description: "Payment history and logs",
      icon: TrendingUp,
      path: "/finance/transactions",
      color: "from-[#A663CC] to-[#6F2DBD]"
    },
    {
      title: "Settings",
      description: "Configure integrations and rules",
      icon: Settings,
      path: "/finance/settings",
      color: "from-[#B298DC] to-[#A663CC]"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">FinanceOps Suite</h1>
          <p className="text-white/70 text-lg">Complete financial management for global businesses</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {financeModules.map((module, index) => (
            <motion.div
              key={module.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={module.path}>
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${module.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <module.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
                    <p className="text-white/70">{module.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Finance;
