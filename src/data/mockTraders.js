export const TRADERS = [
  {
    id: "nexus-7", // done
    name: "NEXUS-7", //done
    role: "Momentum Trader", //done
    description:
      "Aggressive momentum-based strategy targeting high-velocity tech stocks", //done
    color: "#00d4ff", //done
    colorDim: "rgba(0, 212, 255, 0.15)", //done
    colorRgb: "0, 212, 255", //done
    gradient: "from-cyan-500/20 to-blue-600/20", //done
    initialBalance: 1247583.42, //done
    personality: "aggressive", //done
    holdings: [
      { ticker: "NVDA", shares: 450, avgPrice: 142.3, currentPrice: 158.75 },
      { ticker: "TSLA", shares: 280, avgPrice: 285.5, currentPrice: 312.4 },
      { ticker: "AMD", shares: 1200, avgPrice: 178.2, currentPrice: 195.8 },
      { ticker: "META", shares: 320, avgPrice: 505.0, currentPrice: 542.15 },
      { ticker: "MSFT", shares: 180, avgPrice: 445.6, currentPrice: 468.9 },
    ], //done
    cash: 89420.15,
    winRate: 0.73,
    totalTrades: 1847,
    todayTrades: 23,
  },
  {
    id: "oracle-x",
    name: "ORACLE-X",
    role: "Value Analyst",
    description:
      "Deep fundamental analysis with long-term value investing approach",
    color: "#a855f7",
    colorDim: "rgba(168, 85, 247, 0.15)",
    colorRgb: "168, 85, 247",
    gradient: "from-purple-500/20 to-violet-600/20",
    initialBalance: 2183947.88,
    personality: "conservative",
    holdings: [
      { ticker: "BRK.B", shares: 800, avgPrice: 425.0, currentPrice: 448.3 },
      { ticker: "JNJ", shares: 1500, avgPrice: 162.4, currentPrice: 171.85 },
      { ticker: "PG", shares: 900, avgPrice: 168.9, currentPrice: 175.2 },
      { ticker: "KO", shares: 2000, avgPrice: 61.5, currentPrice: 64.8 },
      { ticker: "JPM", shares: 600, avgPrice: 198.75, currentPrice: 215.4 },
    ],
    cash: 312580.44,
    winRate: 0.81,
    totalTrades: 432,
    todayTrades: 5,
  },
  {
    id: "phantom",
    name: "PHANTOM",
    role: "Arbitrage Hunter",
    description:
      "High-frequency cross-market arbitrage with microsecond execution",
    color: "#10b981",
    colorDim: "rgba(16, 185, 129, 0.15)",
    colorRgb: "16, 185, 129",
    gradient: "from-emerald-500/20 to-green-600/20",
    initialBalance: 892341.57,
    personality: "calculated",
    holdings: [
      { ticker: "SPY", shares: 2000, avgPrice: 548.2, currentPrice: 556.4 },
      { ticker: "QQQ", shares: 1500, avgPrice: 498.3, currentPrice: 512.7 },
      { ticker: "IWM", shares: 3000, avgPrice: 212.4, currentPrice: 218.9 },
      { ticker: "GLD", shares: 800, avgPrice: 235.6, currentPrice: 241.3 },
      { ticker: "TLT", shares: 1200, avgPrice: 98.4, currentPrice: 101.2 },
    ],
    cash: 45230.88,
    winRate: 0.68,
    totalTrades: 12493,
    todayTrades: 187,
  },
  {
    id: "sentinel",
    name: "SENTINEL",
    role: "Risk Manager",
    description:
      "Portfolio protection with dynamic hedging and risk-adjusted allocation",
    color: "#f59e0b",
    colorDim: "rgba(245, 158, 11, 0.15)",
    colorRgb: "245, 158, 11",
    gradient: "from-amber-500/20 to-orange-600/20",
    initialBalance: 1564829.33,
    personality: "defensive",
    holdings: [
      { ticker: "VIX", shares: 5000, avgPrice: 14.2, currentPrice: 16.85 },
      { ticker: "SH", shares: 3000, avgPrice: 13.8, currentPrice: 14.2 },
      { ticker: "GOVT", shares: 4000, avgPrice: 24.6, currentPrice: 25.1 },
      { ticker: "UUP", shares: 2500, avgPrice: 28.4, currentPrice: 28.95 },
      { ticker: "SPLV", shares: 1800, avgPrice: 68.2, currentPrice: 70.45 },
    ],
    cash: 524180.22,
    winRate: 0.76,
    totalTrades: 892,
    todayTrades: 14,
  },
];

export const ACTIVITY_TEMPLATES = {
  "nexus-7": [
    {
      type: "research",
      messages: [
        "Scanning momentum signals across 847 tech equities...",
        "Analyzing RSI divergence on NVDA — breakout probability 78%",
        "Cross-referencing social sentiment with price velocity...",
        "Identified momentum shift in semiconductor sector",
        "Backtesting entry pattern against 3Y historical data...",
        "Monitoring dark pool activity — unusual volume detected on AMD",
      ],
    },
    {
      type: "analysis",
      messages: [
        "MACD crossover confirmed on 4H timeframe for TSLA",
        "Volume profile analysis: accumulation phase detected",
        "Machine learning model confidence: 84.2% bullish",
        "Sector rotation analysis complete — overweight tech",
        "Fibonacci retracement at 61.8% — key support holding",
      ],
    },
    {
      type: "trade",
      messages: [
        "EXECUTING: BUY 150 NVDA @ $158.42 — momentum entry",
        "EXECUTING: SELL 80 META @ $543.20 — taking profits",
        "FILLED: BUY 200 AMD @ $195.55 — breakout confirmed",
        "LIMIT ORDER: BUY 100 MSFT @ $465.00 — support level",
        "EXECUTING: SELL 50 TSLA @ $313.80 — target reached",
      ],
    },
    {
      type: "risk",
      messages: [
        "Position size check: NVDA exposure within 15% limit",
        "Trailing stop adjusted: TSLA → $298.50",
        "Portfolio beta: 1.34 — within acceptable range",
        "Volatility spike detected — tightening stops",
      ],
    },
    {
      type: "complete",
      messages: [
        "Trade cycle complete — P&L: +$12,430.50",
        "Rebalancing algorithm finished — 3 positions adjusted",
        "End-of-day reconciliation: all positions verified",
        "Strategy performance: +2.4% today, +18.7% MTD",
      ],
    },
  ],
  "oracle-x": [
    {
      type: "research",
      messages: [
        "Parsing 10-K filings for Q4 earnings season...",
        "Fundamental screener: filtering by P/E < 18, ROE > 15%",
        "Analyzing free cash flow trends across healthcare sector",
        "Reading Federal Reserve minutes — rate path implications",
        "Evaluating management quality scores for BRK.B subsidiaries",
        "Cross-referencing institutional ownership changes...",
      ],
    },
    {
      type: "analysis",
      messages: [
        "DCF model update: JNJ intrinsic value = $185.40 (8.2% upside)",
        "Dividend safety score: KO — 97/100 (excellent)",
        "Balance sheet analysis: JPM leverage ratio improving",
        "Competitive moat assessment: PG — WIDE moat confirmed",
        "Earnings quality score recalculated — no red flags",
      ],
    },
    {
      type: "trade",
      messages: [
        "EXECUTING: BUY 200 JNJ @ $171.60 — undervalued entry",
        "EXECUTING: BUY 300 KO @ $64.55 — dividend reinvestment",
        "FILLED: SELL 100 BRK.B @ $449.20 — rebalancing",
        "LIMIT ORDER: BUY 150 JPM @ $210.00 — value zone",
      ],
    },
    {
      type: "risk",
      messages: [
        "Portfolio concentration check: max 12% per position ✓",
        "Dividend coverage ratio: 2.8x — safe",
        "Sector allocation within target bands",
        "Interest rate sensitivity analysis complete",
      ],
    },
    {
      type: "complete",
      messages: [
        "Quarterly rebalancing complete — 2 positions adjusted",
        "Dividend income projection: $47,820 annual",
        "Portfolio quality score: A+ (no deterioration)",
        "Value screen complete: 3 new candidates identified",
      ],
    },
  ],
  phantom: [
    {
      type: "research",
      messages: [
        "Scanning cross-exchange price differentials...",
        "Monitoring ETF NAV premium/discount spreads...",
        "Analyzing futures basis vs spot — 12bps anomaly detected",
        "Index rebalancing prediction model running...",
        "Pair correlation matrix: scanning 2,400 pairs...",
        "Latency optimization: route via NY5 → CME direct",
      ],
    },
    {
      type: "analysis",
      messages: [
        "Statistical arbitrage signal: SPY/IWM spread 2.1σ deviation",
        "Mean reversion probability: 91.3% within 4H window",
        "Triangular arb opportunity: BTC/ETH/USDT — 8bps profit",
        "Cross-listed security discrepancy: 15bps on QQQ",
        "Pairs trading Z-score exceeded threshold — initiating",
      ],
    },
    {
      type: "trade",
      messages: [
        "EXECUTING: LONG 500 SPY / SHORT 750 IWM — pairs trade",
        "FILLED: ARB BUY 1000 QQQ @ $512.45 — cross-exchange",
        "EXECUTING: CLOSE pairs position — target reached +$3,420",
        "HIGH-FREQ: 47 micro-trades executed in 2.3 seconds",
        "FILLED: SELL 800 GLD @ $241.55 — reversion play",
      ],
    },
    {
      type: "risk",
      messages: [
        "Execution slippage: 0.3bps average — within tolerance",
        "Correlation breakdown detector: all pairs stable",
        "Counterparty risk assessment: exchanges verified",
        "Max drawdown circuit breaker: 2.1% (threshold: 3%)",
      ],
    },
    {
      type: "complete",
      messages: [
        "Arbitrage cycle complete — 23 trades, net +$8,742",
        "Daily P&L attribution: stat-arb 62%, pairs 28%, other 10%",
        "Execution quality report: 99.7% fill rate",
        "Latency report: avg 0.8ms — optimal performance",
      ],
    },
  ],
  sentinel: [
    {
      type: "research",
      messages: [
        "Monitoring VIX term structure — contango steepening",
        "Scanning geopolitical risk feeds — 3 new alerts",
        "Analyzing portfolio drawdown scenarios (Monte Carlo)",
        "Credit spread widening detected in HY bonds",
        "Correlation regime detection: transitioning to risk-off",
        "Tail risk assessment: 99th percentile VaR = -4.2%",
      ],
    },
    {
      type: "analysis",
      messages: [
        "Portfolio VaR (95%): $47,230 — within budget",
        "Stress test: -15% market drop → portfolio impact: -6.2%",
        "Beta-adjusted exposure: net 0.35 — defensive posture",
        "Correlation to S&P500: 0.28 — well-hedged",
        "Maximum drawdown analysis: worst-case -8.4%",
      ],
    },
    {
      type: "trade",
      messages: [
        "EXECUTING: BUY 500 VIX calls — tail risk hedge",
        "EXECUTING: BUY 1000 SH @ $14.18 — increasing short hedge",
        "FILLED: SELL 200 SPLV @ $70.60 — rebalancing",
        "EXECUTING: BUY 2000 GOVT @ $25.05 — flight to quality",
        "DYNAMIC HEDGE: adjusting delta exposure by -0.12",
      ],
    },
    {
      type: "risk",
      messages: [
        "ALERT: Portfolio Sharpe ratio dropped to 1.42",
        "Hedging efficiency: 87% of downside captured",
        "Margin utilization: 34% — comfortable buffer",
        "Risk budget remaining: 62% — room for allocation",
        "ALERT: Regime change detected — increasing hedge ratio",
      ],
    },
    {
      type: "complete",
      messages: [
        "Daily risk report generated — all metrics within bounds",
        "Hedge ratio optimization complete — cost reduced 12%",
        "Portfolio insurance renewed — 30-day rolling protection",
        "End-of-day risk summary: GREEN — all systems nominal",
      ],
    },
  ],
};

export const RECENT_TRADES_TEMPLATES = {
  "nexus-7": [
    {
      side: "BUY",
      ticker: "NVDA",
      shares: 150,
      price: 158.42,
      time: "14:32:18",
    },
    {
      side: "SELL",
      ticker: "META",
      shares: 80,
      price: 543.2,
      time: "14:28:05",
    },
    {
      side: "BUY",
      ticker: "AMD",
      shares: 200,
      price: 195.55,
      time: "13:45:33",
    },
    {
      side: "SELL",
      ticker: "TSLA",
      shares: 50,
      price: 313.8,
      time: "12:15:42",
    },
    {
      side: "BUY",
      ticker: "MSFT",
      shares: 100,
      price: 466.3,
      time: "11:22:17",
    },
    { side: "BUY", ticker: "NVDA", shares: 75, price: 155.8, time: "10:08:55" },
    {
      side: "SELL",
      ticker: "AMD",
      shares: 300,
      price: 192.4,
      time: "09:45:22",
    },
  ],
  "oracle-x": [
    { side: "BUY", ticker: "JNJ", shares: 200, price: 171.6, time: "13:15:08" },
    { side: "BUY", ticker: "KO", shares: 300, price: 64.55, time: "11:42:33" },
    {
      side: "SELL",
      ticker: "BRK.B",
      shares: 100,
      price: 449.2,
      time: "10:30:15",
    },
    { side: "BUY", ticker: "PG", shares: 150, price: 174.8, time: "09:55:42" },
    { side: "BUY", ticker: "JPM", shares: 100, price: 214.2, time: "09:32:18" },
  ],
  phantom: [
    { side: "BUY", ticker: "SPY", shares: 500, price: 556.2, time: "14:45:02" },
    {
      side: "SELL",
      ticker: "IWM",
      shares: 750,
      price: 219.1,
      time: "14:45:02",
    },
    {
      side: "SELL",
      ticker: "SPY",
      shares: 500,
      price: 556.85,
      time: "14:47:15",
    },
    { side: "BUY", ticker: "IWM", shares: 750, price: 218.6, time: "14:47:15" },
    {
      side: "BUY",
      ticker: "QQQ",
      shares: 1000,
      price: 512.45,
      time: "13:22:48",
    },
    {
      side: "SELL",
      ticker: "QQQ",
      shares: 1000,
      price: 513.2,
      time: "13:23:01",
    },
    {
      side: "SELL",
      ticker: "GLD",
      shares: 800,
      price: 241.55,
      time: "12:05:33",
    },
    { side: "BUY", ticker: "GLD", shares: 800, price: 240.8, time: "11:58:42" },
  ],
  sentinel: [
    { side: "BUY", ticker: "VIX", shares: 500, price: 16.42, time: "14:20:08" },
    { side: "BUY", ticker: "SH", shares: 1000, price: 14.18, time: "13:45:22" },
    {
      side: "SELL",
      ticker: "SPLV",
      shares: 200,
      price: 70.6,
      time: "12:30:15",
    },
    {
      side: "BUY",
      ticker: "GOVT",
      shares: 2000,
      price: 25.05,
      time: "11:15:42",
    },
    { side: "BUY", ticker: "UUP", shares: 500, price: 28.8, time: "10:22:08" },
  ],
};
