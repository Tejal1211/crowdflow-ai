# backend/main.py
import os
import random
import time
from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx

app = FastAPI(
    title="CrowdFlow AI API",
    description="Smart Stadium Experience Platform Backend",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

# ─── Models ───────────────────────────────────────────────
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    reply: str
    timestamp: str

# ─── Mock data generators ──────────────────────────────────
GATE_NAMES = ["Gate A", "Gate B", "Gate C", "Gate D", "Gate E", "Gate F"]
ZONE_NAMES = ["North Stand", "South Stand", "East Wing", "West Wing", "VIP Lounge", "Concourse"]
FOOD_STALLS = ["Burger Hub", "Pizza Corner", "Snack Bar", "Beverage Station", "Grill House", "Noodle Express"]

def gen_gates():
    return [
        {
            "id": i + 1,
            "name": name,
            "waitTime": random.randint(2, 18),
            "crowdLevel": random.randint(20, 95),
            "status": "open" if random.random() > 0.15 else "closed",
            "throughput": random.randint(40, 120),
        }
        for i, name in enumerate(GATE_NAMES)
    ]

def gen_zones():
    return [
        {
            "id": i + 1,
            "name": name,
            "occupancy": random.randint(30, 100),
            "capacity": 5000,
            "trend": "up" if random.random() > 0.5 else "down",
            "alerts": 1 if random.random() > 0.85 else 0,
        }
        for i, name in enumerate(ZONE_NAMES)
    ]

def gen_food_stalls():
    return [
        {
            "id": i + 1,
            "name": name,
            "waitTime": random.randint(3, 25),
            "queueLength": random.randint(5, 50),
            "status": "busy" if random.random() > 0.85 else "open",
            "rating": round(random.uniform(3.8, 5.0), 1),
        }
        for i, name in enumerate(FOOD_STALLS)
    ]

def gen_alerts():
    all_alerts = [
        {"type": "warning", "msg": "High crowd density at North Stand"},
        {"type": "info", "msg": "Gate B now open — reduced wait time"},
        {"type": "warning", "msg": "Long queue at Burger Hub"},
        {"type": "success", "msg": "West Wing cleared — fast access"},
        {"type": "info", "msg": "Parking Lot C is 85% full"},
    ]
    count = random.randint(2, 4)
    return [
        {**a, "id": i + 1, "time": f"{random.randint(1, 10)}m ago"}
        for i, a in enumerate(all_alerts[:count])
    ]

# ─── Routes ────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "ok", "service": "CrowdFlow AI API", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.get("/api/live-data")
def get_live_data():
    """Returns all live stadium data."""
    gates = gen_gates()
    open_gates = [g for g in gates if g["status"] == "open"]
    best_gate = min(open_gates, key=lambda g: g["waitTime"]) if open_gates else gates[0]

    return {
        "gates": gates,
        "zones": gen_zones(),
        "foodStalls": gen_food_stalls(),
        "alerts": gen_alerts(),
        "summary": {
            "totalVisitors": random.randint(28000, 45000),
            "avgWaitTime": random.randint(6, 15),
            "crowdLevel": random.randint(55, 88),
            "satisfaction": random.randint(82, 96),
            "bestGate": best_gate["name"],
        },
        "lastUpdated": datetime.utcnow().isoformat(),
    }

@app.get("/api/gates")
def get_gates():
    return {"gates": gen_gates(), "timestamp": datetime.utcnow().isoformat()}

@app.get("/api/zones")
def get_zones():
    return {"zones": gen_zones(), "timestamp": datetime.utcnow().isoformat()}

@app.get("/api/food-stalls")
def get_food_stalls():
    return {"stalls": gen_food_stalls(), "timestamp": datetime.utcnow().isoformat()}

@app.get("/api/alerts")
def get_alerts():
    return {"alerts": gen_alerts(), "timestamp": datetime.utcnow().isoformat()}

@app.get("/api/restrooms")
def get_restrooms():
    rooms = [
        {"id": 1, "name": "Block A - Level 1", "available": random.randint(2, 10), "total": 12, "waitTime": random.randint(0, 8)},
        {"id": 2, "name": "Block B - Level 2", "available": random.randint(0, 8), "total": 10, "waitTime": random.randint(0, 12)},
        {"id": 3, "name": "Block C - Main", "available": random.randint(4, 15), "total": 16, "waitTime": random.randint(0, 5)},
        {"id": 4, "name": "VIP Section", "available": random.randint(3, 6), "total": 6, "waitTime": 0},
    ]
    return {"restrooms": rooms, "timestamp": datetime.utcnow().isoformat()}

@app.get("/api/analytics")
def get_analytics():
    """Returns chart data for analytics page."""
    visitor_trend = [
        {
            "time": f"{9 + i}:00",
            "visitors": random.randint(1000, 5000),
            "queueTime": random.randint(3, 18),
            "satisfaction": random.randint(78, 98),
        }
        for i in range(12)
    ]
    zone_occ = [
        {"zone": name.split()[0], "occupancy": random.randint(30, 100)}
        for name in ZONE_NAMES
    ]
    return {
        "visitorTrend": visitor_trend,
        "zoneOccupancy": zone_occ,
        "totalVisitors": random.randint(35000, 50000),
        "avgWait": round(random.uniform(5.0, 15.0), 1),
        "peakZone": random.choice(ZONE_NAMES),
        "satisfaction": random.randint(85, 97),
    }

# ─── AI Chat ────────────────────────────────────────────────
SYSTEM_PROMPT = """You are CrowdFlow AI, a smart stadium assistant. You help fans with:
- Best entry gates and wait times
- Food stall recommendations and queue times
- Restroom availability and directions
- Crowd levels and zone info
- Exit planning and navigation
- Emergency assistance

Keep responses helpful, concise, and friendly. Use emojis sparingly for key info.
Always provide specific, actionable advice. Reference actual stadium data when available.
"""

@app.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    """AI chat endpoint using Gemini API."""
    if not GEMINI_API_KEY:
        # Return demo response if no API key
        reply = get_demo_response(req.message)
        return ChatResponse(reply=reply, timestamp=datetime.utcnow().isoformat())

    # Build Gemini request
    contents = []
    for msg in req.history[-6:]:
        contents.append({
            "role": "user" if msg.role == "user" else "model",
            "parts": [{"text": msg.content}]
        })
    contents.append({"role": "user", "parts": [{"text": req.message}]})

    payload = {
        "contents": contents,
        "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "generationConfig": {
            "maxOutputTokens": 512,
            "temperature": 0.7,
        }
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            res = await client.post(
                f"{GEMINI_URL}?key={GEMINI_API_KEY}",
                json=payload
            )
            res.raise_for_status()
            data = res.json()
            reply = data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as e:
            reply = get_demo_response(req.message)

    return ChatResponse(reply=reply, timestamp=datetime.utcnow().isoformat())


def get_demo_response(message: str) -> str:
    msg = message.lower()
    if any(w in msg for w in ["gate", "entry", "enter"]):
        return "🚪 **Best Gate Right Now: Gate B**\n\nGate B has only a 3-minute wait — the shortest across all gates. Gate A has 9 min, Gate C has 12 min. Head to Gate B via the South Corridor for fastest entry."
    if any(w in msg for w in ["restroom", "toilet", "bathroom"]):
        return "🚻 **Nearest Restroom: Block A - Level 1**\n\nBlock A Level 1 has 8/12 stalls available with no wait. Turn left at the main concourse past the merchandise stall — about 2 minutes from the main seating area."
    if any(w in msg for w in ["food", "stall", "eat", "hungry", "burger"]):
        return "🍔 **Fastest Food Stall: Snack Bar Row 7**\n\nOnly a 6-minute wait right now. Burger Hub has a 22-minute queue — avoid it. Beverage Station is 8 minutes. Walk via Section 5 exit for quickest access."
    if any(w in msg for w in ["exit", "leave", "out"]):
        return "🏃 **Best Exit: Gate D (South Exit)**\n\nEstimated 8-minute wait vs 35 minutes at Gate A. Bus Route 42 departs every 5 minutes from South Plaza. Leave 10 minutes before the final whistle for the smoothest exit."
    if any(w in msg for w in ["crowd", "occupancy", "busy"]):
        return "👥 **Stadium at 74% capacity** (38,400/52,000 fans)\n\n• 🔴 North Stand — 94% (very crowded)\n• 🟡 South Stand — 68%\n• 🟢 East Wing — 42% (most space)\n\nEast Wing is the most comfortable zone right now."
    if any(w in msg for w in ["sos", "emergency", "help", "medical"]):
        return "🆘 **Emergency Alert Processing...**\n\nYour SOS has been transmitted to Stadium Security and Medical Response. A staff member will reach you within 2 minutes. Stadium helpline: +91-22-1234-5678. Stay where you are."
    return "Hi! I'm your CrowdFlow AI Stadium Assistant 🏟️\n\nI can help with:\n• Best gate entry (try 'best gate?')\n• Food queue times (try 'fastest food?')\n• Restroom locations\n• Exit planning\n• Emergency SOS\n\nWhat do you need?"
