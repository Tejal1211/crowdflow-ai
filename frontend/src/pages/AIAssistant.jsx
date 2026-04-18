// src/pages/AIAssistant.jsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Zap, User, Loader2, RotateCcw, Copy, Check, History, MessageSquare } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../lib/AuthContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const PROMPTS = [
  { label: 'Best gate now?', icon: '🚪' },
  { label: 'Nearest restroom?', icon: '🚻' },
  { label: 'Fastest food stall?', icon: '🍔' },
  { label: 'Best exit route?', icon: '🏃' },
  { label: 'Current crowd levels?', icon: '👥' },
  { label: 'SOS - I need help', icon: '🆘' },
];

// Simulated AI responses for demo mode (no backend needed)
const DEMO_RESPONSES = {
  'best gate': `🚪 **Best Gate Right Now: Gate B**

Gate B currently has the shortest wait time at just **3 minutes**. Here's a quick comparison:

• Gate A — 9 min (moderate crowd)
• **Gate B — 3 min ✅ Recommended**
• Gate C — 12 min (busy)
• Gate D — 6 min

Head to Gate B via the South Corridor for fastest entry. The gate throughput is 85 fans/min right now.`,
  'restroom': `🚻 **Nearest Available Restroom**

Based on your last known location (Section 4, Row 12):

• **Block A - Level 1** — 2 min walk, 8/12 stalls available ✅
• Block B - Level 2 — 4 min walk, 3/10 stalls (wait: 5 min)
• Block C - Main — 6 min walk, fully available

I recommend Block A on Level 1 — turn left at the main concourse, it's right past the merchandise stall.`,
  'food': `🍔 **Fastest Food Stall Right Now**

• **Snack Bar (Row 7)** — 6 min wait ✅ Fastest
• Beverage Station — 8 min wait
• Noodle Express — 11 min wait
• Burger Hub — 22 min wait ❌ Avoid

Snack Bar Row 7 is your best bet! They serve hot dogs, nachos, and drinks. Walk via Section 5 exit — 3 min from your seat.`,
  'exit': `🏃 **Best Exit Route After the Match**

To avoid the post-match rush (expected 80K+ fans):

**Recommended: Gate D (South Exit)**
• 4 min walk from your section
• Estimated wait: 8 min (vs. 35 min at Gate A)
• Bus Route 42 departs every 5 min from South Plaza

Leave 10 minutes before the final whistle for the smoothest exit. Gate F is also good if you are in the East Wing.`,
  'crowd': `👥 **Current Crowd Intelligence**

**Stadium Occupancy: 74%** (38,400 / 52,000 fans)

• 🔴 North Stand — 94% (avoid)
• 🟡 South Stand — 68%
• 🟢 East Wing — 42% (spacious)
• 🟡 West Wing — 71%
• 🟢 VIP Lounge — 55%

Crowd is expected to peak at kick-off in ~15 minutes. If you haven't taken your seat, heading through Gate D → East Wing will be the most comfortable route.`,
  'sos': `🆘 **Emergency Alert Sent!**

Your SOS has been transmitted to:
✅ Stadium Security Control Room
✅ Medical Response Team
✅ Gate Management

**Your location has been flagged.** A staff member will reach you within 2 minutes.

📞 Direct Stadium Helpline: **+91-22-1234-5678**

Please stay where you are and remain calm. Help is on the way.`,
};

function getDemo(input) {
  const lower = input.toLowerCase();
  if (lower.includes('gate') || lower.includes('entry') || lower.includes('enter')) return DEMO_RESPONSES['best gate'];
  if (lower.includes('restroom') || lower.includes('toilet') || lower.includes('bathroom')) return DEMO_RESPONSES['restroom'];
  if (lower.includes('food') || lower.includes('stall') || lower.includes('eat') || lower.includes('hungry') || lower.includes('burger')) return DEMO_RESPONSES['food'];
  if (lower.includes('exit') || lower.includes('leave') || lower.includes('out')) return DEMO_RESPONSES['exit'];
  if (lower.includes('crowd') || lower.includes('occupancy') || lower.includes('level')) return DEMO_RESPONSES['crowd'];
  if (lower.includes('sos') || lower.includes('help') || lower.includes('emergency')) return DEMO_RESPONSES['sos'];
  return `I'm your CrowdFlow AI Stadium Assistant! 🏟️\n\nI can help you with:\n• Best gate entry routes\n• Queue wait times\n• Restroom availability\n• Food stall recommendations\n• Exit planning\n• Emergency SOS\n\nWhat can I help you with today?`;
}

function Message({ msg }) {
  const [copied, setCopied] = useState(false);
  const isAI = msg.role === 'assistant';

  const copy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple markdown-ish rendering
  const rendered = msg.content
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-semibold text-gray-900 mt-2">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.startsWith('• ')) {
        return <p key={i} className="pl-2 text-gray-700">{line}</p>;
      }
      if (line.match(/\*\*(.*?)\*\*/)) {
        const parts = line.split(/\*\*(.*?)\*\*/);
        return (
          <p key={i} className="text-gray-700">
            {parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="text-gray-900">{p}</strong> : p)}
          </p>
        );
      }
      return line ? <p key={i} className="text-gray-700">{line}</p> : <br key={i} />;
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 group ${isAI ? '' : 'flex-row-reverse'}`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 ${
        isAI ? 'bg-primary-600' : 'bg-gray-200'
      }`}>
        {isAI ? <Zap className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-gray-600" />}
      </div>
      <div className={`max-w-[80%] ${isAI ? '' : ''}`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed space-y-1 ${
          isAI ? 'bg-white border border-gray-100 shadow-sm' : 'bg-primary-600 text-white'
        }`}>
          {isAI ? rendered : <p>{msg.content}</p>}
        </div>
        {isAI && (
          <button
            onClick={copy}
            className="mt-1.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function AIAssistant() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('chat'); // 'chat' or 'history'
  const bottomRef = useRef(null);

  // Load chat history from localStorage
  useEffect(() => {
    if (user) {
      const historyKey = `crowdflow_chat_${user.uid}`;
      const savedHistory = localStorage.getItem(historyKey);
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory);
          setMessages(parsedHistory);
        } catch (error) {
          console.error('Failed to parse chat history:', error);
          // Fallback to default welcome message
          setMessages([{
            id: 1,
            role: 'assistant',
            content: `Hi ${user?.displayName?.split(' ')[0] || 'there'}! 👋 I'm your CrowdFlow AI Stadium Assistant.\n\nI can help you find the fastest gates, shortest queues, navigate to your seat, or anything else about your stadium experience. What do you need?`,
          }]);
        }
      } else {
        // No history, show welcome message
        setMessages([{
          id: 1,
          role: 'assistant',
          content: `Hi ${user?.displayName?.split(' ')[0] || 'there'}! 👋 I'm your CrowdFlow AI Stadium Assistant.\n\nI can help you find the fastest gates, shortest queues, navigate to your seat, or anything else about your stadium experience. What do you need?`,
        }]);
      }
    }
  }, [user]);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (user && messages.length > 0) {
      const historyKey = `crowdflow_chat_${user.uid}`;
      localStorage.setItem(historyKey, JSON.stringify(messages));
    }
  }, [messages, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;

    const userMsg = { id: Date.now(), role: 'user', content: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Try backend first
      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history: messages.slice(-6) }),
        signal: AbortSignal.timeout(8000),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: data.reply }]);
      } else {
        throw new Error('backend error');
      }
    } catch {
      // Fallback to demo responses
      await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
      const reply = getDemo(trimmed);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: reply }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    const newMessage = {
      id: Date.now(),
      role: 'assistant',
      content: `Chat cleared! How can I help you with your stadium experience? 🏟️`,
    };
    setMessages([newMessage]);
    // Clear from localStorage
    if (user) {
      const historyKey = `crowdflow_chat_${user.uid}`;
      localStorage.removeItem(historyKey);
    }
  };

  // Get formatted chat history for display
  const getChatHistory = () => {
    if (!user) return [];
    
    const historyKey = `crowdflow_chat_${user.uid}`;
    const savedHistory = localStorage.getItem(historyKey);
    
    if (!savedHistory) return [];
    
    try {
      const parsedHistory = JSON.parse(savedHistory);
      // Group messages by conversation (split by assistant welcome messages)
      const conversations = [];
      let currentConversation = [];
      
      parsedHistory.forEach((msg, index) => {
        if (msg.role === 'assistant' && msg.content.includes('Hi') && msg.content.includes('CrowdFlow AI Stadium Assistant')) {
          if (currentConversation.length > 0) {
            conversations.push([...currentConversation]);
          }
          currentConversation = [msg];
        } else {
          currentConversation.push(msg);
        }
      });
      
      if (currentConversation.length > 0) {
        conversations.push(currentConversation);
      }
      
      return conversations.reverse(); // Show most recent first
    } catch (error) {
      console.error('Failed to parse chat history:', error);
      return [];
    }
  };

  return (
    <AppLayout title="AI Assistant">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-gray-900">Stadium AI Assistant</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-emerald-600 font-medium">Online · Powered by Gemini</span>
                {messages.length > 1 && viewMode === 'chat' && (
                  <span className="text-xs text-gray-500 ml-2">· {messages.length - 1} messages in history</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* View Toggle Buttons */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('chat')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'chat'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Chat
              </button>
              <button
                onClick={() => setViewMode('history')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'history'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <History className="w-4 h-4" />
                History
              </button>
            </div>
            <button onClick={clearChat} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {viewMode === 'chat' ? (
          <>
            {/* Quick prompts */}
            <div className="flex flex-wrap gap-2 mb-4">
              {PROMPTS.map(({ label, icon }) => (
                <button
                  key={label}
                  onClick={() => sendMessage(label)}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 transition-all disabled:opacity-50"
                >
                  <span>{icon}</span>{label}
                </button>
              ))}
            </div>

            {/* Chat window */}
            <div className="bg-gray-50/60 border border-gray-100 rounded-2xl overflow-hidden">
              <div className="h-[420px] overflow-y-auto p-4 space-y-4" id="chat-scroll">
                {messages.map(msg => <Message key={msg.id} msg={msg} />)}
                {loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                    <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-primary-500 animate-spin" />
                      <span className="text-sm text-gray-500">Analyzing stadium data...</span>
                    </div>
                  </motion.div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-100 p-3 bg-white">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Ask about gates, queues, navigation..."
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 disabled:opacity-60"
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={loading || !input.trim()}
                    className="w-10 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Powered by Google Gemini · Real-time stadium data
                </p>
              </div>
            </div>
          </>
        ) : (
          /* History View */
          <div className="bg-gray-50/60 border border-gray-100 rounded-2xl overflow-hidden">
            <div className="h-[500px] overflow-y-auto p-4">
              {(() => {
                const history = getChatHistory();
                if (history.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Chat History</h3>
                      <p className="text-gray-500">Your conversations with the AI assistant will appear here.</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-medium text-gray-900">Chat History</h3>
                      <p className="text-sm text-gray-500 mt-1">{history.length} conversation{history.length !== 1 ? 's' : ''} found</p>
                    </div>
                    
                    {history.map((conversation, convIndex) => (
                      <motion.div
                        key={convIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: convIndex * 0.1 }}
                        className="bg-white border border-gray-200 rounded-xl p-4"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 bg-primary-100 rounded-lg flex items-center justify-center">
                            <MessageSquare className="w-3 h-3 text-primary-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            Conversation {history.length - convIndex}
                          </span>
                          <span className="text-xs text-gray-500">
                            {conversation.length} messages
                          </span>
                        </div>
                        
                        <div className="space-y-3 max-h-48 overflow-y-auto">
                          {conversation.slice(0, 4).map((msg, msgIndex) => (
                            <div key={msg.id} className="flex gap-2">
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                msg.role === 'assistant' ? 'bg-primary-100' : 'bg-gray-100'
                              }`}>
                                {msg.role === 'assistant' ? 
                                  <Zap className="w-3 h-3 text-primary-600" /> : 
                                  <User className="w-3 h-3 text-gray-600" />
                                }
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm ${
                                  msg.role === 'assistant' ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                  {msg.content.length > 100 ? 
                                    `${msg.content.substring(0, 100)}...` : 
                                    msg.content
                                  }
                                </p>
                              </div>
                            </div>
                          ))}
                          {conversation.length > 4 && (
                            <p className="text-xs text-gray-500 text-center">
                              +{conversation.length - 4} more messages
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
