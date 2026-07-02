import { motion, AnimatePresence } from 'motion/react';
import { X, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Clock, DollarSign } from 'lucide-react';
import { formatCurrency } from '../data/simulation';

function HoldingRow({ holding }) {
  const pnl = (holding.currentPrice - holding.avgPrice) * holding.shares;
  const pnlPercent = ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100;
  const isPositive = pnl >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-white/[0.03] transition-colors group"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center border border-white/[0.08]">
          <span className="text-[10px] font-bold font-mono text-white/80">
            {holding.ticker.substring(0, 2)}
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{holding.ticker}</p>
          <p className="text-[10px] text-white/30 font-mono">
            {holding.shares} shares @ ${holding.avgPrice.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold font-mono tabular-nums text-white">
          ${holding.currentPrice.toFixed(2)}
        </p>
        <div className={`flex items-center justify-end gap-1 text-[11px] font-mono tabular-nums ${
          isPositive ? 'text-[#00e68a]' : 'text-[#ff4d6a]'
        }`}>
          {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
          <span>{isPositive ? '+' : ''}{formatCurrency(pnl)}</span>
          <span className="text-white/20 ml-1">({isPositive ? '+' : ''}{pnlPercent.toFixed(1)}%)</span>
        </div>
      </div>
    </motion.div>
  );
}

function TradeRow({ trade }) {
  const isBuy = trade.side === 'BUY';
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/[0.03] transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
          isBuy
            ? 'bg-[#00e68a]/10 text-[#00e68a]'
            : 'bg-[#ff4d6a]/10 text-[#ff4d6a]'
        }`}>
          {isBuy ? 'B' : 'S'}
        </div>
        <div>
          <p className="text-xs font-semibold text-white">
            {trade.side} {trade.shares} {trade.ticker}
          </p>
          <p className="text-[10px] text-white/30 font-mono flex items-center gap-1">
            <Clock size={8} />
            {trade.time}
          </p>
        </div>
      </div>
      <p className="text-xs font-semibold font-mono tabular-nums text-white">
        ${trade.price.toFixed(2)}
      </p>
    </motion.div>
  );
}

export default function PortfolioModal({ isOpen, onClose, trader }) {
  if (!trader) return null;

  const totalHoldingsValue = trader.holdings.reduce(
    (sum, h) => sum + h.currentPrice * h.shares,
    0
  );
  const totalHoldingsCost = trader.holdings.reduce(
    (sum, h) => sum + h.avgPrice * h.shares,
    0
  );
  const holdingsPnl = totalHoldingsValue - totalHoldingsCost;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 flex flex-col"
          >
            <div
              className="h-full flex flex-col overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(13, 18, 32, 0.97) 0%, rgba(20, 28, 46, 0.97) 100%)',
                backdropFilter: 'blur(40px)',
                borderLeft: `1px solid rgba(${trader.colorRgb}, 0.15)`,
                boxShadow: `-20px 0 60px rgba(0, 0, 0, 0.5), -1px 0 0 rgba(${trader.colorRgb}, 0.1)`,
              }}
            >
              {/* Header */}
              <div className="p-6 border-b border-white/[0.06]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                      style={{
                        backgroundColor: `rgba(${trader.colorRgb}, 0.15)`,
                        color: trader.color,
                        boxShadow: `0 0 20px rgba(${trader.colorRgb}, 0.1)`,
                      }}
                    >
                      {trader.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">{trader.name}</h2>
                      <p className="text-[11px] text-white/40">{trader.role} — Portfolio</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <X size={16} className="text-white/50" />
                  </button>
                </div>

                {/* Summary stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/[0.03] rounded-lg p-3 border border-white/[0.05]">
                    <p className="text-[9px] text-white/30 uppercase tracking-wider font-medium">Holdings Value</p>
                    <p className="text-sm font-bold font-mono tabular-nums text-white mt-1">
                      {formatCurrency(totalHoldingsValue)}
                    </p>
                  </div>
                  <div className="bg-white/[0.03] rounded-lg p-3 border border-white/[0.05]">
                    <p className="text-[9px] text-white/30 uppercase tracking-wider font-medium">Cash</p>
                    <p className="text-sm font-bold font-mono tabular-nums text-white mt-1">
                      {formatCurrency(trader.cash)}
                    </p>
                  </div>
                  <div className="bg-white/[0.03] rounded-lg p-3 border border-white/[0.05]">
                    <p className="text-[9px] text-white/30 uppercase tracking-wider font-medium">Unrealized P&L</p>
                    <p className={`text-sm font-bold font-mono tabular-nums mt-1 ${
                      holdingsPnl >= 0 ? 'text-[#00e68a]' : 'text-[#ff4d6a]'
                    }`}>
                      {holdingsPnl >= 0 ? '+' : ''}{formatCurrency(holdingsPnl)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Holdings */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Wallet size={14} style={{ color: trader.color }} />
                    <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Holdings ({trader.holdings.length})
                    </h3>
                  </div>
                  <div className="space-y-0.5">
                    {trader.holdings.map((holding, i) => (
                      <HoldingRow key={holding.ticker} holding={holding} />
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="mx-6 border-t border-white/[0.06]" />

                {/* Recent Trades */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign size={14} style={{ color: trader.color }} />
                    <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Recent Trades
                    </h3>
                  </div>
                  <div className="space-y-0.5">
                    {trader.recentTrades.map((trade, i) => (
                      <TradeRow key={`${trade.ticker}-${trade.time}-${i}`} trade={trade} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
