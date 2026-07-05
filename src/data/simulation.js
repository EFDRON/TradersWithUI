import { useEffect, useRef, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL ?? "http://127.0.0.1:5000";
const POLL_INTERVAL_MS = 10000;
const TRADER_ORDER = ["warren", "george", "ray", "cathie"];

const ACTIVITY_TYPE_MAP = {
  research: "research",
  analysis: "analysis",
  trade: "trade",
  risk: "risk",
  complete: "complete",
  trace: "complete",
  account: "complete",
  span: "complete",
};

function normalizeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeActivity(activity, traderId, index) {
  const type = ACTIVITY_TYPE_MAP[String(activity?.type ?? "").toLowerCase()] ?? "complete";
  const timestamp = activity?.time ?? activity?.timestamp ?? "";

  return {
    id: `${traderId}-${timestamp || index}-${index}`,
    type,
    message: activity?.message ?? "",
    timestamp,
  };
}

function normalizeHoldings(holdings) {
  return (holdings ?? []).map((holding) => ({
    ticker: String(holding?.ticker ?? holding?.symbol ?? "").toUpperCase(),
    shares: normalizeNumber(holding?.shares),
    avgPrice: normalizeNumber(holding?.avgPrice),
    currentPrice: normalizeNumber(holding?.currentPrice),
  }));
}

function normalizeTrades(trades) {
  return (trades ?? []).map((trade) => ({
    ...trade,
    side: String(trade?.side ?? "").toUpperCase(),
    ticker: String(trade?.ticker ?? trade?.symbol ?? "").toUpperCase(),
    time: trade?.time ?? trade?.timestamp ?? "",
    shares: normalizeNumber(trade?.shares ?? Math.abs(trade?.quantity ?? 0)),
    price: normalizeNumber(trade?.price),
  }));
}

function getStatus(trader) {
  if (!trader.activities.length && !trader.recentTrades.length) {
    return "INITIALIZING";
  }

  const latestActivity = trader.activities.at(-1);
  if (latestActivity?.type === "research") return "RESEARCHING";
  if (latestActivity?.type === "analysis") return "ANALYZING";
  if (latestActivity?.type === "trade") return "TRADING";
  if (latestActivity?.type === "risk") return "RISK CHECK";
  if (latestActivity?.type === "complete") return "ACTIVE";

  return trader.recentTrades.length > 0 ? "TRADING" : "ACTIVE";
}

function normalizeTrader(trader, index) {
  const traderId = String(trader?.id ?? trader?.name ?? index).toLowerCase();
  const balanceHistory = (trader?.balanceHistory ?? []).map((point) => ({
    time: String(point?.time ?? ""),
    balance: normalizeNumber(point?.balance),
  }));
  const activities = (trader?.activities ?? []).map((activity, activityIndex) =>
    normalizeActivity(activity, traderId, activityIndex),
  );
  const recentTrades = normalizeTrades(trader?.recentTrades);
  const holdings = normalizeHoldings(trader?.holdings);
  const initialBalance = normalizeNumber(trader?.initialBalance, normalizeNumber(trader?.currentBalance));
  const currentBalance = normalizeNumber(trader?.currentBalance, initialBalance);
  const previousBalance = normalizeNumber(trader?.previousBalance, currentBalance);
  const pnl = normalizeNumber(trader?.pnl, currentBalance - initialBalance);
  const pnlPercent = normalizeNumber(
    trader?.pnlPercent,
    initialBalance ? (pnl / initialBalance) * 100 : 0,
  );

  const normalizedTrader = {
    ...trader,
    id: traderId,
    name: trader?.name ?? traderId,
    role: trader?.role ?? "Trader",
    description: trader?.description ?? "",
    color: trader?.color ?? "#00d4ff",
    colorDim: trader?.colorDim ?? "rgba(0, 212, 255, 0.15)",
    colorRgb: trader?.colorRgb ?? "0, 212, 255",
    gradient: trader?.gradient ?? "linear-gradient(135deg, #00d4ff 0%, #2563eb 100%)",
    initialBalance,
    currentBalance,
    previousBalance,
    pnl,
    pnlPercent,
    cash: normalizeNumber(trader?.cash),
    winRate: normalizeNumber(trader?.winRate),
    totalTrades: normalizeNumber(trader?.totalTrades),
    todayTrades: normalizeNumber(trader?.todayTrades),
    balanceHistory,
    activities,
    recentTrades,
    holdings,
  };

  return {
    ...normalizedTrader,
    status: getStatus(normalizedTrader),
  };
}

function sortTraders(traders) {
  return [...traders].sort((a, b) => {
    const leftIndex = TRADER_ORDER.indexOf(String(a.id).toLowerCase());
    const rightIndex = TRADER_ORDER.indexOf(String(b.id).toLowerCase());

    if (leftIndex === -1 && rightIndex === -1) {
      return String(a.name).localeCompare(String(b.name));
    }
    if (leftIndex === -1) return 1;
    if (rightIndex === -1) return -1;
    return leftIndex - rightIndex;
  });
}

async function fetchTraders(signal) {
  const response = await fetch(`${API_BASE_URL}/traders`, { signal });

  if (!response.ok) {
    throw new Error(`Failed to load traders: ${response.status}`);
  }

  const data = await response.json();
  return sortTraders((Array.isArray(data) ? data : []).map(normalizeTrader));
}

export function useTraderSimulation() {
  const [traders, setTraders] = useState([]);
  const requestInFlight = useRef(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadTraders = async () => {
      if (requestInFlight.current) return;

      requestInFlight.current = true;
      try {
        const liveTraders = await fetchTraders(controller.signal);
        if (isMounted) {
          setTraders(liveTraders);
        }
      } catch (error) {
        if (error?.name !== "AbortError") {
          console.error("Unable to load traders from backend", error);
        }
      } finally {
        requestInFlight.current = false;
      }
    };

    loadTraders();
    const intervalId = setInterval(loadTraders, POLL_INTERVAL_MS);

    return () => {
      isMounted = false;
      controller.abort();
      clearInterval(intervalId);
    };
  }, []);

  return traders;
}

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

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCompact(value) {
  if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return formatCurrency(value);
}