
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, AlertTriangle, Target, Brain, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface FinancialInsight {
  id: string;
  type: 'warning' | 'opportunity' | 'prediction' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionRequired: boolean;
}

interface FinancialMetric {
  name: string;
  current: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  prediction: number;
  unit: string;
}

export const FinancialInsights = () => {
  const [insights, setInsights] = useState<FinancialInsight[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Cash Flow Alert',
      description: 'Cash flow is projected to be negative in 3 months based on current spending patterns.',
      impact: 'high',
      confidence: 85,
      actionRequired: true
    },
    {
      id: '2',
      type: 'opportunity',
      title: 'Cost Optimization',
      description: 'Software subscriptions can be reduced by 25% by consolidating similar tools.',
      impact: 'medium',
      confidence: 78,
      actionRequired: false
    },
    {
      id: '3',
      type: 'prediction',
      title: 'Revenue Forecast',
      description: 'Q2 revenue is predicted to increase by 12% based on current pipeline.',
      impact: 'high',
      confidence: 92,
      actionRequired: false
    }
  ]);

  const [metrics, setMetrics] = useState<FinancialMetric[]>([
    {
      name: 'Monthly Recurring Revenue',
      current: 45000,
      target: 60000,
      trend: 'up',
      prediction: 52000,
      unit: '$'
    },
    {
      name: 'Customer Acquisition Cost',
      current: 120,
      target: 100,
      trend: 'down',
      prediction: 110,
      unit: '$'
    },
    {
      name: 'Gross Margin',
      current: 68,
      target: 75,
      trend: 'up',
      prediction: 72,
      unit: '%'
    },
    {
      name: 'Burn Rate',
      current: 15000,
      target: 12000,
      trend: 'stable',
      prediction: 14500,
      unit: '$'
    }
  ]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'opportunity': return Target;
      case 'prediction': return TrendingUp;
      case 'recommendation': return Brain;
      default: return TrendingUp;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'opportunity': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'prediction': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'recommendation': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      default: return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return DollarSign;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-white mb-2">AI Financial Insights</h2>
        <p className="text-white/70">Predictive analytics and actionable recommendations</p>
      </motion.div>

      {/* AI Insights */}
      <div className="grid gap-4">
        {insights.map((insight, index) => {
          const Icon = getInsightIcon(insight.type);
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`bg-white/10 backdrop-blur-xl border ${getInsightColor(insight.type)}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Icon className="w-6 h-6 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-white font-semibold">{insight.title}</h3>
                          <Badge className={getImpactColor(insight.impact)}>
                            {insight.impact} impact
                          </Badge>
                          {insight.actionRequired && (
                            <Badge variant="outline" className="text-orange-400 border-orange-400">
                              Action Required
                            </Badge>
                          )}
                        </div>
                        <p className="text-white/70 mb-3">{insight.description}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-white/60 text-sm">Confidence:</span>
                          <Progress value={insight.confidence} className="w-20 h-2" />
                          <span className="text-white/60 text-sm">{insight.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Financial Metrics Predictions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              Predictive Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {metrics.map((metric, index) => {
                const TrendIcon = getTrendIcon(metric.trend);
                const progress = (metric.current / metric.target) * 100;
                const predictionProgress = (metric.prediction / metric.target) * 100;
                
                return (
                  <motion.div
                    key={metric.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-medium text-sm">{metric.name}</h4>
                      <TrendIcon className={`w-4 h-4 ${getTrendColor(metric.trend)}`} />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70 text-sm">Current</span>
                        <span className="text-white font-bold">
                          {metric.unit === '%' ? `${metric.current}%` : `${metric.unit}${metric.current.toLocaleString()}`}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-blue-400 text-sm">Predicted (Next Month)</span>
                        <span className="text-blue-400 font-semibold">
                          {metric.unit === '%' ? `${metric.prediction}%` : `${metric.unit}${metric.prediction.toLocaleString()}`}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-white/70 text-sm">Target</span>
                        <span className="text-green-400 font-semibold">
                          {metric.unit === '%' ? `${metric.target}%` : `${metric.unit}${metric.target.toLocaleString()}`}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/60">Current vs Target</span>
                          <span className="text-white/60">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={Math.min(progress, 100)} className="h-2" />
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-blue-300">Prediction vs Target</span>
                          <span className="text-blue-300">{Math.round(predictionProgress)}%</span>
                        </div>
                        <Progress value={Math.min(predictionProgress, 100)} className="h-2" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
