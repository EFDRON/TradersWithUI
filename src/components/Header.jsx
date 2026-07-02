import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, Cpu, Wifi, TrendingUp, Shield } from 'lucide-react';

function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="font-mono text-sm text-white/60 tabular-nums">
      {time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })}
    </span>
  );
}

function StatusIndicator({ label, color = '#00e68a', icon: Icon, pulse = true }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
        {pulse && (
          <div
            className="absolute inset-0 w-2 h-2 rounded-full animate-ping"
            style={{ backgroundColor: color, opacity: 0.4 }}
          />
        )}
      </div>
      {Icon && <Icon size={14} className="text-white/40" />}
      <span className="text-xs text-white/50 font-medium uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

export default function Header({ traders }) {
  const totalValue = traders.reduce((sum, t) => sum + t.currentBalance, 0);
  const totalPnl = traders.reduce((sum, t) => sum + t.pnl, 0);
  const totalTrades = traders.reduce((sum, t) => sum + t.todayTrades, 0);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10"
    >
      <div className="glass-card rounded-2xl px-6 py-4 mx-4 mt-4">
        <div className="flex items-center justify-between">
          {/* Left: Branding */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Activity size={20} className="text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00e68a] border-2 border-[#0d1220]" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wide">
                <span className="text-white">TRADERS</span>
                <span className="text-cyan-400 ml-2">COMMAND CENTER</span>
              </h1>
              <p className="text-[11px] text-white/30 font-medium tracking-widest uppercase">
                Autonomous AI Trading Operations
              </p>
            </div>
          </div>

          {/* Center: Status indicators */}
          <div className="hidden lg:flex items-center gap-6">
            <StatusIndicator label="API Connected" icon={Wifi} color="#00e68a" />
            <StatusIndicator label="Market Open" icon={TrendingUp} color="#00e68a" />
            <StatusIndicator label="4 Agents Active" icon={Cpu} color="#00d4ff" />
            <StatusIndicator label="Risk Normal" icon={Shield} color="#00e68a" />
          </div>

          {/* Right: Clock and metrics */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-right">
              <div>
                <p className="text-[10px] text-white/30 font-medium uppercase tracking-wider">Total AUM</p>
                <p className="text-sm font-semibold font-mono tabular-nums text-white">
                  ${(totalValue / 1000000).toFixed(2)}M
                </p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <p className="text-[10px] text-white/30 font-medium uppercase tracking-wider">Today P&L</p>
                <p className={`text-sm font-semibold font-mono tabular-nums ${
                  totalPnl >= 0 ? 'text-[#00e68a]' : 'text-[#ff4d6a]'
                }`}>
                  {totalPnl >= 0 ? '+' : ''}{(totalPnl / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <p className="text-[10px] text-white/30 font-medium uppercase tracking-wider">Trades</p>
                <p className="text-sm font-semibold font-mono tabular-nums text-white">
                  {totalTrades}
                </p>
              </div>
            </div>
            <div className="w-px h-8 bg-white/10 hidden md:block" />
            <LiveClock />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
