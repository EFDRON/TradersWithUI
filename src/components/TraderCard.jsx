import { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, TrendingUp, TrendingDown, Award, BarChart3, Zap } from 'lucide-react';
import BalanceChart from './BalanceChart';
import ActivityFeed from './ActivityFeed';
import { useAnimatedNumber, formatCurrency } from '../data/simulation';

const STATUS_COLORS = {
  RESEARCHING: '#00d4ff',
  ANALYZING: '#a855f7',
  TRADING: '#10b981',
  'RISK CHECK': '#f59e0b',
  ACTIVE: '#00e68a',
  INITIALIZING: '#ffffff',
};

export default function TraderCard({ trader, index, onViewPortfolio }) {
  const [isHovered, setIsHovered] = useState(false);
  const animatedBalance = useAnimatedNumber(trader.currentBalance);
  const animatedPnl = useAnimatedNumber(trader.pnl);

  const statusColor = STATUS_COLORS[trader.status] || '#ffffff';
  const isPositive = trader.pnl >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Ambient glow behind card on hover */}
      <motion.div
        className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, rgba(${trader.colorRgb}, 0.1), transparent, rgba(${trader.colorRgb}, 0.05))`,
          filter: 'blur(1px)',
        }}
      />

      {/* Card */}
      <div
        className="relative glass-card rounded-2xl overflow-hidden flex flex-col"
        style={{
          borderColor: isHovered
            ? `rgba(${trader.colorRgb}, 0.2)`
            : 'rgba(255, 255, 255, 0.06)',
          transition: 'border-color 0.4s ease',
          minHeight: '520px',
        }}
      >
        {/* Top accent line */}
        <div
          className="h-[2px] w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${trader.color}, transparent)`,
            opacity: isHovered ? 0.8 : 0.3,
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* Chart area */}
        <div className="h-32 px-2 pt-2 relative">
          <BalanceChart
            data={trader.balanceHistory}
            color={trader.color}
            colorRgb={trader.colorRgb}
          />
          {/* Chart overlay gradient */}
          <div
            className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(13, 18, 32, 0.8))',
            }}
          />
        </div>

        {/* Agent Identity */}
        <div className="px-5 pt-2 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="relative">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-base font-black"
                  style={{
                    background: `linear-gradient(135deg, rgba(${trader.colorRgb}, 0.2), rgba(${trader.colorRgb}, 0.05))`,
                    color: trader.color,
                    boxShadow: `0 0 20px rgba(${trader.colorRgb}, 0.15)`,
                  }}
                >
                  {trader.name.charAt(0)}
                </div>
                {/* Animated ring */}
                <div
                  className="absolute -inset-0.5 rounded-xl animate-breathe"
                  style={{
                    border: `1px solid rgba(${trader.colorRgb}, 0.3)`,
                    color: trader.color,
                  }}
                />
              </div>

              <div>
                <h3
                  className="text-base font-bold tracking-wide"
                  style={{ color: trader.color }}
                >
                  {trader.name}
                </h3>
                <p className="text-[10px] text-white/35 font-medium uppercase tracking-wider">
                  {trader.role}
                </p>
              </div>
            </div>

            {/* Status badge */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider"
              style={{
                backgroundColor: `${statusColor}10`,
                color: statusColor,
                border: `1px solid ${statusColor}25`,
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: statusColor }}
              />
              {trader.status}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-5 pb-3">
          <div className="grid grid-cols-3 gap-3">
            {/* Balance */}
            <div>
              <p className="text-[9px] text-white/25 font-medium uppercase tracking-wider mb-0.5">Balance</p>
              <p className="text-sm font-bold font-mono tabular-nums text-white">
                ${(animatedBalance / 1000).toFixed(1)}K
              </p>
            </div>

            {/* P&L */}
            <div>
              <p className="text-[9px] text-white/25 font-medium uppercase tracking-wider mb-0.5">P&L Today</p>
              <div className={`flex items-center gap-1 ${
                isPositive ? 'text-[#00e68a]' : 'text-[#ff4d6a]'
              }`}>
                {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span className="text-sm font-bold font-mono tabular-nums">
                  {isPositive ? '+' : ''}{(animatedPnl / 1000).toFixed(2)}K
                </span>
              </div>
            </div>

            {/* Win Rate */}
            <div>
              <p className="text-[9px] text-white/25 font-medium uppercase tracking-wider mb-0.5">Win Rate</p>
              <div className="flex items-center gap-1 text-white">
                <Award size={12} className="text-amber-400" />
                <span className="text-sm font-bold font-mono tabular-nums">
                  {(trader.winRate * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* View Portfolio Button */}
        <div className="px-5 pb-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onViewPortfolio(trader)}
            className="w-full py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
            style={{
              background: `linear-gradient(135deg, rgba(${trader.colorRgb}, 0.1), rgba(${trader.colorRgb}, 0.05))`,
              border: `1px solid rgba(${trader.colorRgb}, 0.15)`,
              color: trader.color,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, rgba(${trader.colorRgb}, 0.2), rgba(${trader.colorRgb}, 0.1))`;
              e.currentTarget.style.boxShadow = `0 0 20px rgba(${trader.colorRgb}, 0.15)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, rgba(${trader.colorRgb}, 0.1), rgba(${trader.colorRgb}, 0.05))`;
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Eye size={14} />
            View Portfolio
          </motion.button>
        </div>

        {/* Divider */}
        <div
          className="mx-5 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${trader.colorRgb}, 0.15), transparent)`,
          }}
        />

        {/* Activity Feed */}
        <div className="flex-1 px-4 pt-2 pb-3 min-h-0" style={{ maxHeight: '180px' }}>
          <div className="flex items-center gap-2 px-1 mb-1">
            <Zap size={10} style={{ color: trader.color }} />
            <span className="text-[9px] text-white/30 font-semibold uppercase tracking-widest">Live Trace</span>
            <div className="flex-1" />
            <div className="flex items-center gap-0.5">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-0.5 rounded-full"
                  style={{ backgroundColor: trader.color }}
                  animate={{
                    height: [4, 8 + Math.random() * 8, 4],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 0.8 + Math.random() * 0.4,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          </div>
          <ActivityFeed activities={trader.activities} agentColor={trader.color} />
        </div>
      </div>
    </motion.div>
  );
}
