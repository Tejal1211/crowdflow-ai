// src/components/ui/AlertFeed.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle, XCircle, Bell } from 'lucide-react';

const icons = {
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-100' },
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-100' },
  success: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-100' },
  error: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50 border-red-100' },
};

export default function AlertFeed({ alerts }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-gray-900">Live Alerts</h3>
        <Bell className="w-4 h-4 text-gray-400" />
      </div>
      <div className="space-y-2">
        <AnimatePresence>
          {(alerts || []).map((alert) => {
            const { icon: Icon, color, bg } = icons[alert.type] || icons.info;
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`flex items-start gap-3 p-3 rounded-xl border ${bg}`}
              >
                <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${color}`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-700 font-medium">{alert.msg}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{alert.time}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {(!alerts || alerts.length === 0) && (
          <p className="text-sm text-gray-400 text-center py-4">No active alerts</p>
        )}
      </div>
    </div>
  );
}
