// src/pages/Landing.jsx
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, Shield, Navigation2, Map, AlertCircle, MessageSquare,
  ArrowRight, Star, CheckCircle, ChevronRight, Users, Clock, TrendingUp
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';

const features = [
  { icon: Zap, title: 'Smart Gate Entry', desc: 'AI-powered gate routing minimizes wait times and prevents bottlenecks at entry points.', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Clock, title: 'Live Queue Monitoring', desc: 'Real-time queue tracking across food stalls, restrooms, and concessions.', color: 'text-amber-600', bg: 'bg-amber-50' },
  { icon: Navigation2, title: 'Seat Navigation', desc: 'Turn-by-turn indoor navigation to any seat, stall, or facility in the stadium.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: Map, title: 'Crowd Heatmap', desc: 'Live occupancy heatmaps help you visualize and avoid the most crowded zones.', color: 'text-purple-600', bg: 'bg-purple-50' },
  { icon: AlertCircle, title: 'Emergency SOS', desc: 'One-tap SOS alerts connect you instantly to stadium staff and security.', color: 'text-red-600', bg: 'bg-red-50' },
  { icon: MessageSquare, title: 'AI Assistant', desc: 'Ask anything — best exit, fastest food stall, nearest restroom — answered instantly.', color: 'text-indigo-600', bg: 'bg-indigo-50' },
];

const steps = [
  { n: '01', title: 'Sign Up & Arrive', desc: 'Create your account and scan your ticket QR code at the stadium entrance for instant personalization.' },
  { n: '02', title: 'Real-Time Guidance', desc: 'Receive smart gate recommendations, live queue updates, and turn-by-turn navigation to your seat.' },
  { n: '03', title: 'Enjoy the Event', desc: 'Use the AI assistant for anything you need — food, restrooms, exits — while we handle the logistics.' },
];

const testimonials = [
  { name: 'Rahul Mehta', role: 'Season Ticket Holder', rating: 5, text: 'CrowdFlow saved us 25 minutes at the gate. The AI assistant knew exactly which concession had the shortest queue.' },
  { name: 'Priya Singh', role: 'Event Manager', rating: 5, text: 'The admin dashboard gives us real-time crowd visibility we never had before. Incident response time dropped by 40%.' },
  { name: 'James Carter', role: 'Sports Fan', rating: 5, text: 'I used the exit planner after the match and avoided the usual 45-minute jam. Incredible product.' },
];

const whyItems = [
  'Reduce gate wait times by up to 60%',
  'AI-powered crowd flow predictions',
  'Real-time incident alerts & SOS',
  'Works on any smartphone',
  'Zero hardware installation needed',
  'Privacy-first design',
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' } }),
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* HERO */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary-50/60 via-white to-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <span className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-primary-100 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                  Now live at 40+ stadiums worldwide
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
                className="text-5xl lg:text-6xl font-display font-extrabold text-gray-900 leading-tight"
              >
                Seamless Stadium Experiences{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-500">
                  with Real-Time AI
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
                className="mt-6 text-xl text-gray-500 leading-relaxed max-w-lg"
              >
                Avoid crowds, reduce wait times, navigate easily, and enjoy live events stress-free. Powered by AI.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
                className="flex flex-wrap gap-3 mt-8"
              >
                <Link to="/signup" className="btn-primary flex items-center gap-2 text-base px-8 py-3">
                  Try Demo <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/login" className="btn-secondary text-base px-8 py-3">Login</Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="flex items-center gap-6 mt-10"
              >
                {[['45K+', 'Fans Served'], ['98%', 'Satisfaction'], ['2.5min', 'Avg Wait Cut']].map(([val, label]) => (
                  <div key={label}>
                    <p className="text-2xl font-display font-bold text-gray-900">{val}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Hero illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.8 }}
              className="relative float-animation"
            >
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 overflow-hidden">
                {/* Mock dashboard preview */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-5 px-3 flex items-center">
                    <span className="text-xs text-gray-400">crowdflow.ai/dashboard</span>
                  </div>
                </div>
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Gate A', val: '3 min', color: 'bg-emerald-50 text-emerald-700' },
                    { label: 'Crowd', val: '72%', color: 'bg-amber-50 text-amber-700' },
                    { label: 'Queue', val: '8 min', color: 'bg-blue-50 text-blue-700' },
                  ].map(({ label, val, color }) => (
                    <div key={label} className={`${color} rounded-xl p-3 text-center`}>
                      <p className="text-lg font-display font-bold">{val}</p>
                      <p className="text-xs mt-0.5 opacity-70">{label}</p>
                    </div>
                  ))}
                </div>
                {/* Heatmap preview */}
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Live Heatmap</p>
                  <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(10, 1fr)' }}>
                    {Array.from({ length: 50 }).map((_, i) => {
                      const colors = ['#d1fae5', '#86efac', '#fde68a', '#fb923c', '#f87171'];
                      const c = colors[Math.floor(Math.random() * colors.length)];
                      return <div key={i} className="h-4 rounded-sm" style={{ backgroundColor: c }} />;
                    })}
                  </div>
                </div>
                {/* AI assistant preview */}
                <div className="mt-3 bg-primary-50 rounded-xl p-3 flex items-start gap-2">
                  <div className="w-6 h-6 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary-800">AI Assistant</p>
                    <p className="text-xs text-primary-600 mt-0.5">Gate B has only 3 min wait — recommend moving now ✓</p>
                  </div>
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute -top-3 -right-3 bg-white shadow-lg border border-gray-100 rounded-2xl px-3 py-2">
                <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Updates
                </p>
              </div>
              <div className="absolute -bottom-3 -left-3 bg-white shadow-lg border border-gray-100 rounded-2xl px-3 py-2">
                <p className="text-xs font-semibold text-blue-600">🏟️ 40K+ Fans Online</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <span className="badge badge-blue mb-4">Features</span>
            <h2 className="section-title">Everything You Need for a Perfect Event</h2>
            <p className="section-subtitle max-w-2xl mx-auto">Six powerful tools working together to make every stadium visit seamless and stress-free.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color, bg }, i) => (
              <motion.div
                key={title}
                variants={fadeUp} custom={i * 0.5} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="card-hover group"
              >
                <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="font-display font-semibold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/60">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <span className="badge badge-blue mb-4">How It Works</span>
            <h2 className="section-title">Three Simple Steps</h2>
            <p className="section-subtitle max-w-xl mx-auto">From arrival to the final whistle, CrowdFlow AI guides you every step of the way.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ n, title, desc }, i) => (
              <motion.div
                key={n}
                variants={fadeUp} custom={i * 0.5} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="relative"
              >
                <div className="text-6xl font-display font-extrabold text-primary-100 leading-none mb-4">{n}</div>
                <h3 className="font-display font-semibold text-gray-900 text-xl mb-3">{title}</h3>
                <p className="text-gray-500 leading-relaxed">{desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 right-0 translate-x-1/2 text-gray-200">
                    <ChevronRight className="w-8 h-8" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CROWDFLOW */}
      <section id="about" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <span className="badge badge-blue mb-4">Why CrowdFlow AI</span>
              <h2 className="section-title mb-6">Built for the Modern Stadium Experience</h2>
              <div className="space-y-3">
                {whyItems.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Link to="/signup" className="btn-primary inline-flex items-center gap-2">
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} custom={2} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { val: '60%', label: 'Reduction in gate wait times', color: 'bg-primary-600', text: 'text-white' },
                  { val: '40%', label: 'Faster incident response', color: 'bg-emerald-500', text: 'text-white' },
                  { val: '98%', label: 'Fan satisfaction score', color: 'bg-amber-400', text: 'text-white' },
                  { val: '40+', label: 'Stadiums globally', color: 'bg-gray-900', text: 'text-white' },
                ].map(({ val, label, color, text }) => (
                  <div key={label} className={`${color} ${text} rounded-3xl p-6`}>
                    <p className="text-4xl font-display font-extrabold">{val}</p>
                    <p className="text-sm mt-2 opacity-80 leading-snug">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/60">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <span className="badge badge-blue mb-4">Testimonials</span>
            <h2 className="section-title">Loved by Fans & Operators</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, rating, text }, i) => (
              <motion.div
                key={name}
                variants={fadeUp} custom={i * 0.5} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="card-hover"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold text-sm">
                    {name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{name}</p>
                    <p className="text-xs text-gray-400">{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="bg-gradient-to-br from-primary-600 to-indigo-600 rounded-3xl p-12 text-white"
          >
            <h2 className="text-4xl font-display font-extrabold mb-4">Ready to Transform Your Event?</h2>
            <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
              Join 40+ stadiums already delivering smarter, stress-free experiences with CrowdFlow AI.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/signup" className="bg-white text-primary-700 font-semibold px-8 py-3 rounded-xl hover:bg-primary-50 transition-colors inline-flex items-center gap-2">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/login" className="border border-primary-400 text-white font-semibold px-8 py-3 rounded-xl hover:bg-primary-500 transition-colors">
                Login
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5 font-display font-bold text-gray-900">
            <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            CrowdFlow AI
          </div>
          <p className="text-sm text-gray-400 text-center">
            Smarter Stadium Experiences Powered by AI
          </p>
          <p className="text-sm text-gray-400">© 2025 CrowdFlow AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
