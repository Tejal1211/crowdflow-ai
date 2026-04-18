// src/pages/Home.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  DoorOpen, Clock, Users, Bell, ArrowRight, MessageSquare,
  Zap, TrendingDown, Star, MapPin, Calendar
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../lib/AuthContext';
import { useLiveData } from '../hooks/useLiveData';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
});

export default function Home() {
  const { user } = useAuth();
  const { data, refresh } = useLiveData(5000);
  const bestGate = data.gates.filter(g => g.status === 'open').sort((a, b) => a.waitTime - b.waitTime)[0];

  const quickCards = [
    {
      label: 'Best Gate Right Now',
      value: bestGate?.name || 'Gate A',
      sub: `${bestGate?.waitTime || 3} min wait`,
      icon: DoorOpen,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      label: 'Avg Queue Time',
      value: `${data.avgWaitTime} min`,
      sub: 'Across all stalls',
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    {
      label: 'Crowd Level',
      value: `${data.crowdLevel}%`,
      sub: 'Stadium occupancy',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      label: 'Active Alerts',
      value: data.alerts.length,
      sub: 'Live notifications',
      icon: Bell,
      color: 'text-red-500',
      bg: 'bg-red-50',
      border: 'border-red-100',
    },
  ];

  const recommendations = [
    { icon: DoorOpen, title: 'Use Gate B', desc: 'Only 4 min wait — lowest in the stadium right now', tag: 'Best Entry', tagColor: 'badge-green' },
    { icon: MapPin, title: 'Avoid North Stand', desc: '94% occupancy — try East Wing for a better view', tag: 'Crowd Alert', tagColor: 'badge-yellow' },
    { icon: Clock, title: 'Snack Bar - Row 7', desc: 'Shortest food queue (6 min). Burger Hub is 22 min', tag: 'Fast Queue', tagColor: 'badge-blue' },
  ];

  return (
    <AppLayout title="Home" onRefresh={refresh} lastUpdated={data.lastUpdated}>
      {/* Welcome */}
      <motion.div {...fadeUp(0)} className="mb-8">
        <h2 className="text-2xl font-display font-bold text-gray-900">
          Welcome back, {user?.displayName?.split(' ')[0] || 'Fan'} 👋
        </h2>
        <p className="text-gray-500 mt-1">Here's what's happening at the stadium right now.</p>
      </motion.div>

      {/* Quick cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickCards.map(({ label, value, sub, icon: Icon, color, bg, border }, i) => (
          <motion.div key={label} {...fadeUp(i * 0.08)} className={`card border ${border}`}>
            <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className="text-2xl font-display font-bold text-gray-900 mt-1">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Smart Recommendations */}
        <motion.div {...fadeUp(0.2)} className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-gray-900">Smart Recommendations</h3>
              <span className="badge badge-blue">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                Live
              </span>
            </div>
            <div className="space-y-3">
              {recommendations.map(({ icon: Icon, title, desc, tag, tagColor }, i) => (
                <motion.div key={title} {...fadeUp(0.3 + i * 0.1)}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-primary-50/30 transition-colors"
                >
                  <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                    <Icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-gray-900 text-sm">{title}</span>
                      <span className={`badge ${tagColor} text-xs`}>{tag}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Live event + upcoming */}
        <div className="space-y-4">
          {/* Live event */}
          <motion.div {...fadeUp(0.3)} className="card bg-gradient-to-br from-primary-600 to-indigo-600 text-white border-0">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-semibold text-primary-100">LIVE NOW</span>
            </div>
            <h4 className="font-display font-bold text-xl mb-1">Mumbai Indians vs CSK</h4>
            <p className="text-primary-200 text-sm mb-3">Wankhede Stadium • T20 Match</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-white/80">🏏 Inning 2 - Over 14</span>
              <span className="font-bold">156/4</span>
            </div>
            <div className="mt-4 flex gap-2">
              <Link to="/dashboard" className="flex-1 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold py-2 rounded-xl text-center transition-colors">
                Dashboard
              </Link>
              <Link to="/assistant" className="flex-1 bg-white text-primary-700 text-sm font-semibold py-2 rounded-xl text-center hover:bg-primary-50 transition-colors">
                Ask AI
              </Link>
            </div>
          </motion.div>

          {/* Upcoming match */}
          <motion.div {...fadeUp(0.4)} className="card">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">Upcoming Match</span>
            </div>
            <h4 className="font-display font-semibold text-gray-900 mb-1">RCB vs KKR</h4>
            <p className="text-xs text-gray-500 mb-3">Tomorrow • 7:30 PM • DY Patil Stadium</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                <div className="w-2/3 h-full bg-primary-400 rounded-full" />
              </div>
              <span className="text-xs text-gray-400">67% sold</span>
            </div>
            <p className="text-xs text-amber-600 font-medium mt-2">Expected peak crowd — plan early entry</p>
          </motion.div>
        </div>
      </div>

      {/* AI CTA */}
      <motion.div {...fadeUp(0.5)} className="mt-6">
        <div className="bg-gradient-to-r from-gray-50 to-primary-50/40 border border-gray-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-display font-semibold text-gray-900">Ask Your AI Stadium Assistant</h4>
            <p className="text-sm text-gray-500 mt-0.5">Get instant answers about gates, queues, navigation, and more.</p>
          </div>
          <Link to="/assistant" className="btn-primary flex items-center gap-2 text-sm flex-shrink-0">
            Open Assistant <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </AppLayout>
  );
}
