import { motion } from 'motion/react';
import { useAnimatedNumber, formatCurrency } from '../data/simulation';
import { BarChart3, Zap, Target, Clock } from 'lucide-react';

function MetricCard({ icon: Icon, label, value, subValue, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card rounded-xl p-4 flex items-center gap-3"
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="text-[10px] text-white/40 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-base font-semibold font-mono tabular-nums text-white">{value}</p>
        {subValue && (
          <p className="text-[10px] text-white/30 font-mono">{subValue}</p>
        )}
      </div>
    </motion.div>
  );
}

export default function SystemMetrics({ traders }) {
  const totalValue = traders.reduce((sum, t) => sum + t.currentBalance, 0);
  const totalPnl = traders.reduce((sum, t) => sum + t.pnl, 0);
  const totalTrades = traders.reduce((sum, t) => sum + t.todayTrades, 0);
  const avgWinRate = traders.reduce((sum, t) => sum + t.winRate, 0) / traders.length;

  const animatedTotal = useAnimatedNumber(totalValue);
  const animatedPnl = useAnimatedNumber(totalPnl);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mx-4 mt-4">
      <MetricCard
        icon={BarChart3}
        label="Total Portfolio Value"
        value={`$${(animatedTotal / 1000000).toFixed(3)}M`}
        subValue="Across 4 agents"
        color="#00d4ff"
        delay={0.1}
      />
      <MetricCard
        icon={Zap}
        label="Combined P&L"
        value={`${animatedPnl >= 0 ? '+' : ''}$${(animatedPnl / 1000).toFixed(2)}K`}
        subValue={`${((totalPnl / (totalValue - totalPnl)) * 100).toFixed(2)}%`}
        color={totalPnl >= 0 ? '#00e68a' : '#ff4d6a'}
        delay={0.2}
      />
      <MetricCard
        icon={Target}
        label="Avg Win Rate"
        value={`${(avgWinRate * 100).toFixed(1)}%`}
        subValue={`${totalTrades} trades today`}
        color="#a855f7"
        delay={0.3}
      />
      <MetricCard
        icon={Clock}
        label="Market Session"
        value="ACTIVE"
        subValue="NYSE • NASDAQ"
        color="#10b981"
        delay={0.4}
      />
    </div>
  );
}
