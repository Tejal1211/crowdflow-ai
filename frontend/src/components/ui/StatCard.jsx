// src/components/ui/StatCard.jsx
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, unit = '', icon: Icon, iconColor = 'text-primary-600', iconBg = 'bg-primary-50', trend, trendLabel, delay = 0 }) {
  const isPositive = trend > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="card-hover"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-display font-bold text-gray-900">{value}</span>
            {unit && <span className="text-sm text-gray-400 font-medium">{unit}</span>}
          </div>
          {trendLabel && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trendLabel}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`w-11 h-11 ${iconBg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
