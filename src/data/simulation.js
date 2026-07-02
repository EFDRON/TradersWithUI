import { useState, useEffect, useCallback, useRef } from 'react';
import { TRADERS, ACTIVITY_TEMPLATES, RECENT_TRADES_TEMPLATES } from './mockTraders';

// Generate initial balance history (last 60 data points)
function generateInitialHistory(baseBalance, points = 60) {
  const history = [];
  let balance = baseBalance * 0.92; // Start lower
  const volatility = baseBalance * 0.003;
  const drift = (baseBalance - balance) / points;

  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.45) * volatility + drift;
    balance += change;
    history.push({
      time: new Date(Date.now() - (points - i) * 30000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      balance: Math.round(balance * 100) / 100,
    });
  }
  return history;
}

// Generate a random activity event
function generateActivity(traderId) {
  const templates = ACTIVITY_TEMPLATES[traderId];
  if (!templates) return null;

  const typeGroup = templates[Math.floor(Math.random() * templates.length)];
  const message = typeGroup.messages[Math.floor(Math.random() * typeGroup.messages.length)];

  return {
    id: `${traderId}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    type: typeGroup.type,
    message,
    timestamp: new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  };
}

// Get status based on recent activity
function getStatus(activities) {
  if (activities.length === 0) return 'INITIALIZING';
  const lastType = activities[activities.length - 1]?.type;
  switch (lastType) {
    case 'research': return 'RESEARCHING';
    case 'analysis': return 'ANALYZING';
    case 'trade': return 'TRADING';
    case 'risk': return 'RISK CHECK';
    case 'complete': return 'ACTIVE';
    default: return 'ACTIVE';
  }
}

// Main simulation hook
export function useTraderSimulation() {
  const [traders, setTraders] = useState(() =>
    TRADERS.map((trader) => ({
      ...trader,
      currentBalance: trader.initialBalance,
      previousBalance: trader.initialBalance,
      balanceHistory: generateInitialHistory(trader.initialBalance),
      activities: [],
      status: 'INITIALIZING',
      pnl: 0,
      pnlPercent: 0,
      recentTrades: RECENT_TRADES_TEMPLATES[trader.id] || [],
      holdings: trader.holdings.map(h => ({ ...h })),
    }))
  );

  const intervalsRef = useRef([]);

  useEffect(() => {
    // Balance update interval (every 2 seconds)
    const balanceInterval = setInterval(() => {
      setTraders((prev) =>
        prev.map((trader) => {
          const volatility = trader.initialBalance * 0.002;
          const drift = trader.personality === 'aggressive' ? 0.0003
            : trader.personality === 'conservative' ? 0.0001
            : trader.personality === 'calculated' ? 0.0002
            : 0.00005;

          const change = (Math.random() - 0.48) * volatility + trader.initialBalance * drift;
          const newBalance = Math.round((trader.currentBalance + change) * 100) / 100;
          const pnl = Math.round((newBalance - trader.initialBalance) * 100) / 100;
          const pnlPercent = Math.round((pnl / trader.initialBalance) * 10000) / 100;

          const newPoint = {
            time: new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            balance: newBalance,
          };

          // Also slightly fluctuate holdings
          const updatedHoldings = trader.holdings.map((h) => ({
            ...h,
            currentPrice:
              Math.round(
                (h.currentPrice + (Math.random() - 0.48) * h.currentPrice * 0.005) * 100
              ) / 100,
          }));

          return {
            ...trader,
            previousBalance: trader.currentBalance,
            currentBalance: newBalance,
            pnl,
            pnlPercent,
            balanceHistory: [...trader.balanceHistory.slice(-59), newPoint],
            holdings: updatedHoldings,
          };
        })
      );
    }, 2000);

    // Activity feed intervals (staggered per trader for realism)
    const activityIntervals = TRADERS.map((trader, index) => {
      const baseInterval = trader.personality === 'aggressive' ? 2500
        : trader.personality === 'calculated' ? 1800
        : trader.personality === 'conservative' ? 4500
        : 3500;

      return setInterval(() => {
        const newActivity = generateActivity(trader.id);
        if (!newActivity) return;

        setTraders((prev) =>
          prev.map((t) => {
            if (t.id !== trader.id) return t;
            const newActivities = [...t.activities, newActivity].slice(-50);
            return {
              ...t,
              activities: newActivities,
              status: getStatus(newActivities),
            };
          })
        );
      }, baseInterval + Math.random() * 1500);
    });

    intervalsRef.current = [balanceInterval, ...activityIntervals];

    return () => {
      intervalsRef.current.forEach(clearInterval);
    };
  }, []);

  return traders;
}

// Hook for animated number counting
export function useAnimatedNumber(value, duration = 500) {
  const [displayed, setDisplayed] = useState(value);
  const frameRef = useRef(null);
  const startRef = useRef(null);
  const fromRef = useRef(value);

  useEffect(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    fromRef.current = displayed;
    startRef.current = performance.now();

    const animate = (now) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = fromRef.current + (value - fromRef.current) * eased;
      setDisplayed(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value, duration]);

  return displayed;
}

// Format currency
export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Format large numbers compactly
export function formatCompact(value) {
  if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return formatCurrency(value);
}
