// src/components/charts/CrowdHeatmap.jsx
import { motion } from 'framer-motion';

const rows = 8;
const cols = 12;

function getColor(value) {
  if (value < 30) return '#d1fae5';
  if (value < 50) return '#86efac';
  if (value < 65) return '#fde68a';
  if (value < 80) return '#fb923c';
  return '#f87171';
}

function generateHeatmapData() {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      // Stadium shape — center rows are fuller
      const centerBias = 1 - Math.abs(r - rows / 2) / (rows / 2) * 0.3;
      const base = Math.random() * 60 + 20;
      return Math.min(100, Math.floor(base * centerBias));
    })
  );
}

export default function CrowdHeatmap() {
  const data = generateHeatmapData();

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-gray-900">Live Crowd Heatmap</h3>
        <span className="badge badge-blue">Live</span>
      </div>

      {/* Heatmap grid */}
      <div className="bg-gray-50 rounded-xl p-4 overflow-hidden">
        {/* Stadium outline */}
        <div className="relative">
          <div className="grid gap-1" style={{ gridTemplateRows: `repeat(${rows}, 1fr)` }}>
            {data.map((row, r) => (
              <div key={r} className="flex gap-1">
                {row.map((val, c) => (
                  <motion.div
                    key={c}
                    className="heatmap-cell flex-1"
                    style={{
                      height: 24,
                      backgroundColor: getColor(val),
                      opacity: 0.85 + Math.random() * 0.15,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.85 + Math.random() * 0.15 }}
                    transition={{ delay: (r * cols + c) * 0.005, duration: 0.5 }}
                    title={`${val}% occupied`}
                  />
                ))}
              </div>
            ))}
          </div>
          {/* Field label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/80 backdrop-blur px-3 py-1 rounded-lg text-xs font-semibold text-gray-600">
              FIELD
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 flex-wrap">
        {[
          { color: '#d1fae5', label: 'Low (<30%)' },
          { color: '#86efac', label: 'Moderate' },
          { color: '#fde68a', label: 'High (>65%)' },
          { color: '#f87171', label: 'Critical' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
