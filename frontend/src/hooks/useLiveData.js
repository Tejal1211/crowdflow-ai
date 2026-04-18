// src/hooks/useLiveData.js
import { useState, useEffect, useCallback } from 'react';

const GATES = ['Gate A', 'Gate B', 'Gate C', 'Gate D', 'Gate E', 'Gate F'];
const ZONES = ['North Stand', 'South Stand', 'East Wing', 'West Wing', 'VIP Lounge', 'Concourse'];
const FOOD_STALLS = ['Burger Hub', 'Pizza Corner', 'Snack Bar', 'Beverage Station', 'Grill House', 'Noodle Express'];

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateGates() {
  return GATES.map((name, i) => ({
    id: i + 1,
    name,
    waitTime: randomBetween(2, 18),
    crowdLevel: randomBetween(20, 95),
    status: Math.random() > 0.15 ? 'open' : 'closed',
    throughput: randomBetween(40, 120),
  }));
}

function generateZones() {
  return ZONES.map((name, i) => ({
    id: i + 1,
    name,
    occupancy: randomBetween(30, 100),
    capacity: 5000,
    trend: Math.random() > 0.5 ? 'up' : 'down',
    alerts: Math.random() > 0.85 ? 1 : 0,
  }));
}

function generateFoodStalls() {
  return FOOD_STALLS.map((name, i) => ({
    id: i + 1,
    name,
    waitTime: randomBetween(3, 25),
    queueLength: randomBetween(5, 50),
    status: Math.random() > 0.1 ? 'open' : 'busy',
    rating: (Math.random() * 1 + 4).toFixed(1),
  }));
}

function generateAlerts() {
  const alertTypes = [
    { type: 'warning', msg: 'High crowd density at North Stand' },
    { type: 'info', msg: 'Gate B now open — reduced wait time' },
    { type: 'warning', msg: 'Long queue at Burger Hub' },
    { type: 'success', msg: 'West Wing cleared — fast access' },
    { type: 'info', msg: 'Parking Lot C is 85% full' },
    { type: 'warning', msg: 'Restroom Block 3 — 5 min wait' },
  ];
  const count = randomBetween(2, 4);
  return alertTypes.slice(0, count).map((a, i) => ({ ...a, id: i + 1, time: `${randomBetween(1, 10)}m ago` }));
}

function generateRestrooms() {
  return [
    { id: 1, name: 'Block A - Level 1', available: randomBetween(2, 10), total: 12, waitTime: randomBetween(0, 8) },
    { id: 2, name: 'Block B - Level 2', available: randomBetween(0, 8), total: 10, waitTime: randomBetween(0, 12) },
    { id: 3, name: 'Block C - Main', available: randomBetween(4, 15), total: 16, waitTime: randomBetween(0, 5) },
    { id: 4, name: 'VIP Section', available: randomBetween(3, 6), total: 6, waitTime: 0 },
  ];
}

export function useLiveData(interval = 5000) {
  const [data, setData] = useState({
    gates: generateGates(),
    zones: generateZones(),
    foodStalls: generateFoodStalls(),
    alerts: generateAlerts(),
    restrooms: generateRestrooms(),
    totalVisitors: randomBetween(28000, 45000),
    avgWaitTime: randomBetween(6, 15),
    crowdLevel: randomBetween(55, 88),
    satisfaction: randomBetween(82, 96),
    lastUpdated: new Date(),
  });

  const refresh = useCallback(() => {
    setData({
      gates: generateGates(),
      zones: generateZones(),
      foodStalls: generateFoodStalls(),
      alerts: generateAlerts(),
      restrooms: generateRestrooms(),
      totalVisitors: randomBetween(28000, 45000),
      avgWaitTime: randomBetween(6, 15),
      crowdLevel: randomBetween(55, 88),
      satisfaction: randomBetween(82, 96),
      lastUpdated: new Date(),
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(refresh, interval);
    return () => clearInterval(timer);
  }, [refresh, interval]);

  return { data, refresh };
}

export function generateChartData() {
  const hours = Array.from({ length: 12 }, (_, i) => {
    const h = i + 9;
    return {
      time: `${h}:00`,
      visitors: randomBetween(1000, 5000),
      queueTime: randomBetween(3, 18),
      satisfaction: randomBetween(78, 98),
    };
  });
  return hours;
}

export function generateZoneOccupancy() {
  return ZONES.map(name => ({
    zone: name.split(' ')[0],
    occupancy: randomBetween(30, 100),
    capacity: 100,
  }));
}
