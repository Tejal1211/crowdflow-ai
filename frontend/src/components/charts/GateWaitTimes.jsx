// src/components/charts/GateWaitTimes.jsx
import { motion } from 'framer-motion';
import { DoorOpen, Clock, Users } from 'lucide-react';

function StatusBadge({ status }) {
  if (status === 'closed') return <span className="badge badge-red">Closed</span>;
  return <span className="badge badge-green">Open</span>;
}

function WaitBar({ value, max = 20 }) {
  const pct = Math.min(100, (value / max) * 100);
  const color = pct < 40 ? 'bg-emerald-500' : pct < 70 ? 'bg-amber-400' : 'bg-red-400';
  return (
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <motion.div
        className={`h-full ${color} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
}

export default function GateWaitTimes({ gates }) {
  const bestGate = gates?.filter(g => g.status === 'open').sort((a, b) => a.waitTime - b.waitTime)[0];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-gray-900">Gate Wait Times</h3>
        {bestGate && (
          <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-lg">
            Best: {bestGate.name}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {(gates || []).map((gate, i) => (
          <motion.div
            key={gate.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`p-3 rounded-xl border ${gate.status === 'closed' ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-100'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <DoorOpen className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-semibold text-gray-800">{gate.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={gate.status} />
              </div>
            </div>
            <WaitBar value={gate.waitTime} />
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {gate.waitTime} min wait
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Users className="w-3 h-3" />
                {gate.crowdLevel}% full
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
