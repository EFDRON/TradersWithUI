import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, BarChart2, DollarSign, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

const TYPE_CONFIG = {
  research: {
    icon: Search,
    color: '#00d4ff',
    label: 'SCAN',
  },
  analysis: {
    icon: BarChart2,
    color: '#a855f7',
    label: 'ANALYZE',
  },
  trade: {
    icon: DollarSign,
    color: '#10b981',
    label: 'TRADE',
  },
  risk: {
    icon: AlertTriangle,
    color: '#f59e0b',
    label: 'RISK',
  },
  complete: {
    icon: CheckCircle,
    color: '#00e68a',
    label: 'DONE',
  },
};

export default function ActivityFeed({ activities, agentColor }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activities]);

  return (
    <div className="relative h-full">
      {/* Fade gradient at top */}
      <div
        className="absolute top-0 left-0 right-0 h-6 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(13, 18, 32, 0.9), transparent)',
        }}
      />

      <div
        ref={scrollRef}
        className="h-full overflow-y-auto pr-1 space-y-1 scroll-smooth"
        style={{ scrollbarWidth: 'thin' }}
      >
        <AnimatePresence initial={false}>
          {activities.map((activity) => {
            const config = TYPE_CONFIG[activity.type] || TYPE_CONFIG.complete;
            const Icon = config.icon;

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 30,
                  mass: 0.8,
                }}
                className="flex items-start gap-2 py-1.5 px-2 rounded-md group"
              >
                {/* Type indicator */}
                <div
                  className="w-1 h-1 rounded-full mt-1.5 shrink-0"
                  style={{
                    backgroundColor: config.color,
                    boxShadow: `0 0 4px ${config.color}`,
                  }}
                />

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[9px] font-bold font-mono uppercase tracking-wider"
                      style={{ color: config.color }}
                    >
                      {config.label}
                    </span>
                    <span className="text-[9px] text-white/20 font-mono">
                      {activity.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/50 leading-snug group-hover:text-white/70 transition-colors">
                    {activity.message}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {activities.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Zap size={16} className="text-white/20 mx-auto mb-2" />
              <p className="text-[11px] text-white/20">Initializing agent...</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1 h-1 rounded-full bg-white/30"
                    style={{
                      animation: `typing-dots 1.4s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
