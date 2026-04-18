// src/pages/AdminDashboard.jsx
import { motion } from 'framer-motion';
import {
  Users, MapPin, AlertTriangle, Clock, TrendingUp, TrendingDown,
  Activity, ShieldAlert, UserCheck, Settings
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Cell
} from 'recharts';
import AppLayout from '../components/layout/AppLayout';
import AlertFeed from '../components/ui/AlertFeed';
import CrowdHeatmap from '../components/charts/CrowdHeatmap';
import { useLiveData } from '../hooks/useLiveData';

const ZONE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

function AdminStatCard({ title, value, unit, icon: Icon, iconBg, iconColor, trend, trendLabel, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="card-hover"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-display font-bold text-gray-900">{value}</span>
            {unit && <span className="text-sm text-gray-400">{unit}</span>}
          </div>
          {trendLabel && (
            <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${trend > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trendLabel}
            </div>
          )}
        </div>
        <div className={`w-11 h-11 ${iconBg} rounded-2xl flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { data, refresh } = useLiveData(5000);

  // Zone chart data
  const zoneData = data.zones.map(z => ({
    name: z.name.split(' ')[0],
    occupancy: z.occupancy,
    capacity: 100,
  }));

  // Queue trend (simulated hourly)
  const queueTrend = Array.from({ length: 8 }, (_, i) => ({
    time: `${9 + i}:00`,
    avgWait: Math.floor(Math.random() * 12) + 4,
    incidents: Math.floor(Math.random() * 4),
  }));

  // Incidents today
  const incidents = [
    { type: 'Medical', count: 2, color: '#ef4444' },
    { type: 'Security', count: 1, color: '#f59e0b' },
    { type: 'Crowd', count: 5, color: '#3b82f6' },
    { type: 'Infra', count: 1, color: '#8b5cf6' },
  ];

  const peakZone = data.zones.reduce((a, b) => a.occupancy > b.occupancy ? a : b, data.zones[0]);

  return (
    <AppLayout isAdmin title="Admin Overview" onRefresh={refresh} lastUpdated={data.lastUpdated}>
      <div className="space-y-6">
        {/* Admin stat row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard
            title="Total Visitors" value={data.totalVisitors.toLocaleString()}
            icon={Users} iconBg="bg-blue-50" iconColor="text-blue-600"
            trend={1} trendLabel="+12% from last event" delay={0}
          />
          <AdminStatCard
            title="Peak Zone" value={peakZone?.name?.split(' ')[0] || 'North'}
            unit={`${peakZone?.occupancy || 0}%`}
            icon={MapPin} iconBg="bg-amber-50" iconColor="text-amber-600"
            trend={-1} trendLabel="High density" delay={0.08}
          />
          <AdminStatCard
            title="Open Alerts" value={data.alerts.length}
            icon={AlertTriangle} iconBg="bg-red-50" iconColor="text-red-500"
            trend={-1} trendLabel="Needs attention" delay={0.16}
          />
          <AdminStatCard
            title="Avg Wait Time" value={data.avgWaitTime}
            unit="min"
            icon={Clock} iconBg="bg-emerald-50" iconColor="text-emerald-600"
            trend={1} trendLabel="Down from 14 min" delay={0.24}
          />
        </div>

        {/* Heatmap + Alerts */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CrowdHeatmap />
          </div>
          <AlertFeed alerts={data.alerts} />
        </div>

        {/* Crowd by zone + Queue trend */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Zone occupancy bar chart */}
          <div className="card">
            <h3 className="font-display font-semibold text-gray-900 mb-4">Crowd by Zone</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={zoneData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12 }}
                  formatter={(v) => [`${v}%`, 'Occupancy']}
                />
                <Bar dataKey="occupancy" radius={[6, 6, 0, 0]} maxBarSize={40}>
                  {zoneData.map((_, i) => (
                    <Cell key={i} fill={ZONE_COLORS[i % ZONE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Queue trend area chart */}
          <div className="card">
            <h3 className="font-display font-semibold text-gray-900 mb-4">Queue Wait Trend (Today)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={queueTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="queueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12 }}
                  formatter={(v) => [`${v} min`, 'Avg Wait']}
                />
                <Area type="monotone" dataKey="avgWait" stroke="#3b82f6" strokeWidth={2} fill="url(#queueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Incidents + Staff */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Incidents today */}
          <div className="card">
            <h3 className="font-display font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-gray-500" />
              Incidents Today
            </h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={incidents} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis dataKey="type" type="category" tick={{ fontSize: 11, fill: '#64748b' }} width={60} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={28}>
                  {incidents.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
              <span className="text-sm text-gray-500">Total incidents: <strong className="text-gray-900">9</strong></span>
              <span className="badge badge-yellow">2 unresolved</span>
            </div>
          </div>

          {/* Staff deployment */}
          <div className="card">
            <h3 className="font-display font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-gray-500" />
              Staff Deployment
            </h3>
            <div className="space-y-3">
              {[
                { zone: 'Main Entry Gates', staff: 12, required: 10, status: 'OK' },
                { zone: 'North Stand', staff: 8, required: 12, status: 'LOW' },
                { zone: 'Food Court', staff: 15, required: 14, status: 'OK' },
                { zone: 'Medical Bay', staff: 4, required: 4, status: 'OK' },
                { zone: 'VIP Lounge', staff: 6, required: 6, status: 'OK' },
              ].map(({ zone, staff, required, status }) => (
                <div key={zone} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{zone}</p>
                    <p className="text-xs text-gray-400">{staff} / {required} staff</p>
                  </div>
                  <span className={`badge ${status === 'LOW' ? 'badge-red' : 'badge-green'}`}>{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
