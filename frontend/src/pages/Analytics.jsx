// src/pages/Analytics.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  RadialBarChart, RadialBar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, Users, Clock, Star, Download } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { generateChartData, generateZoneOccupancy } from '../hooks/useLiveData';
import { analytics } from '../lib/firebase';
import { logEvent } from 'firebase/analytics';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

function ChartCard({ title, subtitle, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="card"
    >
      <div className="mb-4">
        <h3 className="font-display font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [visitorData, setVisitorData] = useState([]);
  const [zoneData, setZoneData] = useState([]);
  const [satisfactionData, setSatisfactionData] = useState([]);

  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'page_view', {
        page_title: 'Analytics Dashboard',
        page_location: window.location.href
      });
    }
  }, []);

  useEffect(() => {
    setVisitorData(generateChartData());
    setZoneData(generateZoneOccupancy());
    setSatisfactionData([
      { name: 'Excellent', value: 42, fill: '#10b981' },
      { name: 'Good', value: 35, fill: '#3b82f6' },
      { name: 'Average', value: 16, fill: '#f59e0b' },
      { name: 'Poor', value: 7, fill: '#ef4444' },
    ]);
  }, []);

  const queueData = visitorData.map(d => ({
    time: d.time,
    food: Math.floor(Math.random() * 15) + 4,
    gates: Math.floor(Math.random() * 12) + 2,
    restroom: Math.floor(Math.random() * 8) + 1,
  }));

  const kpis = [
    { label: 'Total Visitors Today', value: '38,421', trend: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Avg Gate Wait', value: '6.2 min', trend: '-40%', icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Peak Occupancy', value: '94%', trend: 'North Stand', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Fan Satisfaction', value: '91%', trend: '+3% vs last event', icon: Star, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const handleDownloadReport = () => {
    if (analytics) logEvent(analytics, 'analytics_report_download');
    // Simulate download
    const data = {
      visitorData,
      zoneData,
      satisfactionData,
      generatedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crowdflow-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout title="Analytics">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time crowd flow insights and performance metrics</p>
        </div>
        <button
          onClick={handleDownloadReport}
          className="btn-primary flex items-center gap-2 px-4 py-2"
        >
          <Download className="w-4 h-4" />
          Download Report
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map(({ label, value, trend, icon: Icon, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card-hover"
          >
            <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className="text-2xl font-display font-bold text-gray-900 mt-1">{value}</p>
            <p className={`text-xs mt-1 font-medium ${trend.startsWith('+') || trend.startsWith('-') ? (trend.startsWith('-') && label.includes('Wait') ? 'text-emerald-600' : trend.startsWith('+') ? 'text-emerald-600' : 'text-red-500') : 'text-gray-400'}`}>
              {trend}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="space-y-6">
        {/* Visitor trend */}
        <ChartCard title="Visitor Trend" subtitle="Hourly fan arrivals throughout the event" delay={0.1}>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={visitorData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="visitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="visitors" name="Visitors" stroke="#3b82f6" strokeWidth={2} fill="url(#visitGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Zone + Queue side by side */}
        <div className="grid lg:grid-cols-2 gap-6">
          <ChartCard title="Zone Occupancy" subtitle="Current fill rate by stadium zone" delay={0.15}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={zoneData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="zone" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} formatter={(v) => [`${v}%`, 'Occupancy']} />
                <Bar dataKey="occupancy" name="Occupancy %" radius={[6, 6, 0, 0]} maxBarSize={40}>
                  {zoneData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Queue Performance" subtitle="Avg wait times by category (minutes)" delay={0.2}>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={queueData.slice(0, 8)} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="food" name="Food Stalls" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="gates" name="Entry Gates" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="restroom" name="Restrooms" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Satisfaction */}
        <div className="grid lg:grid-cols-3 gap-6">
          <ChartCard title="Fan Satisfaction" subtitle="Post-event ratings distribution" delay={0.25}>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={satisfactionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {satisfactionData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v}%`, '']} contentStyle={{ borderRadius: '12px', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {satisfactionData.map(({ name, value, fill }) => (
                <div key={name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: fill }} />
                  <span className="text-xs text-gray-600">{name} ({value}%)</span>
                </div>
              ))}
            </div>
          </ChartCard>

          <div className="lg:col-span-2">
            <ChartCard title="Hourly Satisfaction Score" subtitle="Fan happiness throughout the event (0–100)" delay={0.3}>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={visitorData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="satGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="satisfaction" name="Satisfaction" stroke="#10b981" strokeWidth={2} fill="url(#satGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
