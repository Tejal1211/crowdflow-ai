// src/pages/UserDashboard.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UtensilsCrossed, MapPin, Navigation2, AlertTriangle, Phone,
  Clock, Users, CheckCircle, XCircle, ArrowRight, LogOut, User,
  Upload, Camera
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import CrowdHeatmap from '../components/charts/CrowdHeatmap';
import GateWaitTimes from '../components/charts/GateWaitTimes';
import AlertFeed from '../components/ui/AlertFeed';
import { useLiveData } from '../hooks/useLiveData';
import { useAuth } from '../lib/AuthContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, analytics } from '../lib/firebase';
import { logEvent } from 'firebase/analytics';

function FoodStallCard({ stall, delay }) {
  const isBusy = stall.status === 'busy';
  const barColor = stall.waitTime < 10 ? 'bg-emerald-500' : stall.waitTime < 18 ? 'bg-amber-400' : 'bg-red-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold text-gray-900 text-sm">{stall.name}</p>
          <div className="flex items-center gap-1 mt-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i < Math.round(stall.rating) ? 'bg-amber-400' : 'bg-gray-100'}`} />
            ))}
            <span className="text-xs text-gray-400 ml-1">{stall.rating}</span>
          </div>
        </div>
        <span className={`badge ${isBusy ? 'badge-red' : 'badge-green'}`}>{isBusy ? 'Busy' : 'Open'}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full mb-2">
        <motion.div
          className={`h-full ${barColor} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, (stall.waitTime / 25) * 100)}%` }}
          transition={{ duration: 0.8, delay }}
        />
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{stall.waitTime} min</span>
        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{stall.queueLength} in queue</span>
      </div>
    </motion.div>
  );
}

function RestroomCard({ room, delay }) {
  const pct = Math.round((room.available / room.total) * 100);
  const status = pct > 50 ? 'Available' : pct > 20 ? 'Limited' : 'Full';
  const colors = { Available: 'badge-green', Limited: 'badge-yellow', Full: 'badge-red' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100"
    >
      <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center">
        <MapPin className="w-4 h-4 text-gray-400" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800">{room.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{room.available}/{room.total} available{room.waitTime > 0 ? ` · ${room.waitTime} min wait` : ''}</p>
      </div>
      <span className={`badge ${colors[status]}`}>{status}</span>
    </motion.div>
  );
}

export default function UserDashboard() {
  const { data, refresh } = useLiveData(5000);
  const [sosActive, setSosActive] = useState(false);
  const { user, logout } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(user?.profileImage || null);

  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'page_view', {
        page_title: 'User Dashboard',
        page_location: window.location.href
      });
    }
  }, []);

  const handleRefresh = () => {
    refresh();
    if (analytics) logEvent(analytics, 'dashboard_refresh');
  };

  const handleSOS = () => {
    setSosActive(true);
    setTimeout(() => setSosActive(false), 4000);
    if (analytics) logEvent(analytics, 'sos_activated');
  };

  const handleLogout = async () => {
    await logout();
    if (analytics) logEvent(analytics, 'user_logout');
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !user?.uid) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setProfileImageUrl(downloadURL);
      
      // Update user data in Firestore with profile image URL
      // Note: In a real app, you'd update the user document here
      
      if (analytics) logEvent(analytics, 'profile_image_uploaded');
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AppLayout title="My Dashboard" onRefresh={handleRefresh} lastUpdated={data.lastUpdated}>
      <div className="space-y-6">

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="relative">
                {profileImageUrl ? (
                  <img 
                    src={profileImageUrl} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
                    <User className="w-8 h-8 text-primary-600" />
                  </div>
                )}
                <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {uploading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4 text-white" />
                  )}
                </label>
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-gray-900 text-lg">
                  Welcome back, {user?.displayName || 'User'}!
                </h3>
                <p className="text-sm text-gray-500 mb-2">{user?.email}</p>
                
                {/* Firestore Data Display */}
                <div className="space-y-1 text-sm">
                  {user?.createdAt && (
                    <p className="text-gray-600">
                      <span className="font-medium">Member since:</span> {new Date(user.createdAt.toDate ? user.createdAt.toDate() : user.createdAt).toLocaleDateString()}
                    </p>
                  )}
                  {user?.lastLogin && (
                    <p className="text-gray-600">
                      <span className="font-medium">Last login:</span> {new Date(user.lastLogin.toDate ? user.lastLogin.toDate() : user.lastLogin).toLocaleDateString()}
                    </p>
                  )}
                  <p className="text-gray-600">
                    <span className="font-medium">Account type:</span> {user?.isDemo ? 'Demo' : 'Premium'}
                  </p>
                </div>
                
                {user?.isDemo && <span className="inline-block mt-2 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Demo Mode</span>}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn-secondary flex items-center gap-2 px-4 py-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </motion.div>

        {/* Row 1: Heatmap + Gate */}
        <div className="grid lg:grid-cols-2 gap-6">
          <CrowdHeatmap />
          <GateWaitTimes gates={data.gates} />
        </div>

        {/* Row 2: Food stalls */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-gray-900 flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-gray-500" />
              Food Stall Queues
            </h3>
            <span className="text-xs text-gray-400">Updated {data.lastUpdated.toLocaleTimeString()}</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.foodStalls.map((stall, i) => (
              <FoodStallCard key={stall.id} stall={stall} delay={i * 0.07} />
            ))}
          </div>
        </div>

        {/* Row 3: Restrooms + Alerts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-gray-500" />
              <h3 className="font-display font-semibold text-gray-900">Restroom Availability</h3>
            </div>
            <div className="space-y-2">
              {data.restrooms.map((room, i) => (
                <RestroomCard key={room.id} room={room} delay={i * 0.08} />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <AlertFeed alerts={data.alerts} />
          </div>
        </div>

        {/* Row 4: Smart Exit + SOS */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Smart Exit Planner */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Navigation2 className="w-4 h-4 text-gray-500" />
              <h3 className="font-display font-semibold text-gray-900">Smart Exit Planner</h3>
            </div>
            <div className="space-y-3">
              {[
                { gate: 'Gate D — South Exit', time: '4 min walk', crowd: 'Low', color: 'badge-green', recommended: true },
                { gate: 'Gate A — Main Exit', time: '6 min walk', crowd: 'Moderate', color: 'badge-yellow', recommended: false },
                { gate: 'Gate F — East Exit', time: '8 min walk', crowd: 'High', color: 'badge-red', recommended: false },
              ].map(({ gate, time, crowd, color, recommended }, i) => (
                <div key={gate} className={`flex items-center justify-between p-3 rounded-xl border ${recommended ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-gray-100'}`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-800">{gate}</span>
                      {recommended && <span className="badge badge-green">Best Route</span>}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{time} · Crowd: {crowd}</p>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-white/80 text-gray-400 hover:text-primary-600 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SOS */}
          <div className="card flex flex-col items-center justify-center text-center gap-4 py-8">
            <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h3 className="font-display font-bold text-gray-900 text-lg">Emergency SOS</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-xs">
                Press the button to instantly alert stadium security and medical staff to your location.
              </p>
            </div>
            <motion.button
              onClick={handleSOS}
              disabled={sosActive}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-4 rounded-2xl font-display font-bold text-white text-lg transition-all ${
                sosActive ? 'bg-emerald-500 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200'
              }`}
            >
              {sosActive ? (
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Help is Coming
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Phone className="w-5 h-5" /> Send SOS Alert
                </span>
              )}
            </motion.button>
            {sosActive && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-emerald-600 font-medium"
              >
                Alert sent! Stadium security notified · ETA ~2 min
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
