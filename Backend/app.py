from __future__ import annotations

import sqlite3
from datetime import datetime
from typing import Any

from flask import Flask, jsonify

from database import DB, read_account, read_log
from market import get_share_price
from trading_floor import namesandlastnames
from uuid import uuid4


app = Flask(__name__)

INITIAL_BALANCE = 10_000.0
RECENT_TRADES_LIMIT = 5
RECENT_ACTIVITIES_LIMIT = 10
names=["Warren", "George", "Ray", "Cathie"]

THEMES ={ 

    names[0]:{
        "color": "#00d4ff",
        "colorDim": "rgba(0, 212, 255, 0.15)",
        "colorRgb": "0, 212, 255",
        "gradient": "from-cyan-500/20 to-blue-600/20",
    },

    names[1]:{
        "color": "#10b981",
        "colorDim": "rgba(16, 185, 129, 0.15)",
        "colorRgb": "16, 185, 129",
        "gradient": "from-emerald-500/20 to-green-600/20",
    },
    names[2]:{
        "color": "#a855f7",
        "colorDim":"rgba(168, 85, 247, 0.15)",
        "colorRgb": "168, 85, 247",
        "gradient": "from-purple-500/20 to-violet-600/20",
    },
    names[3]:{
        "color": "#f59e0b",
        "colorDim":  "rgba(245, 158, 11, 0.15)",
        "colorRgb":  "245, 158, 11",
        "gradient": "from-amber-500/20 to-orange-600/20",
    },
   
}


def _list_account_names() -> list[str]:
    with sqlite3.connect(DB) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM accounts ORDER BY name")
        account_names = [row[0] for row in cursor.fetchall()]

    # configured_traders = set(namesandlastnames.keys())
    # return [name for name in account_names if name.capitalize() in configured_traders]
    return account_names


def _role_for_name(name: str) -> str:
    return namesandlastnames.get(name.capitalize(), "Trader")


def _default_account(name: str) -> dict[str, Any]:
    return {
        "id": str(uuid4()),
        "name": name.lower(),
        "balance": INITIAL_BALANCE,
        "strategy": "",
        "holdings": {},
        "transactions": [],
        "portfolio_value_time_series": [],
    }


def _normalize_transactions(transactions: list[Any]) -> list[dict[str, Any]]:
    normalized: list[dict[str, Any]] = []
    for transaction in transactions or []:
        if hasattr(transaction, "model_dump"):
            normalized.append(transaction.model_dump())
        elif isinstance(transaction, dict):
            normalized.append(transaction)
    normalized.sort(key=lambda item: item.get("timestamp", ""))
    return normalized


def _parse_timestamp(value: str) -> datetime | None:
    try:
        return datetime.strptime(value, "%Y-%m-%d %H:%M:%S")
    except Exception:
        return None


def _previous_history_value(history: list[list[Any]] | list[tuple[Any, ...]]) -> float | None:
    if len(history) < 2:
        return None
    try:
        return float(history[-2][1])
    except Exception:
        return None


def _build_position_state(transactions: list[dict[str, Any]]) -> tuple[dict[str, dict[str, float]], dict[str, dict[str, int]]]:
    positions: dict[str, dict[str, float]] = {}
    win_counts: dict[str, dict[str, int]] = {}

    for transaction in transactions:
        symbol = str(transaction.get("symbol", "")).upper()
        if not symbol:
            continue

        quantity = int(transaction.get("quantity", 0))
        price = float(transaction.get("price", 0.0))

        position = positions.setdefault(symbol, {"shares": 0.0, "cost_basis": 0.0})
        win_state = win_counts.setdefault(symbol, {"wins": 0, "closed_trades": 0})

        if quantity > 0:
            position["shares"] += quantity
            position["cost_basis"] += quantity * price
            continue

        sell_quantity = abs(quantity)
        if position["shares"] <= 0:
            continue

        average_cost = position["cost_basis"] / position["shares"] if position["shares"] else 0.0
        if price > average_cost:
            win_state["wins"] += 1
        win_state["closed_trades"] += 1

        position["shares"] = max(0.0, position["shares"] - sell_quantity)
        position["cost_basis"] = max(0.0, position["cost_basis"] - (average_cost * sell_quantity))

    return positions, win_counts


def _safe_share_price(symbol: str, fallback_price: float = 0.0) -> float:
    try:
        price = get_share_price(symbol)
        if price is None:
            return fallback_price
        return float(price)
    except Exception:
        return fallback_price


def _theme_for_name(name: str) -> dict[str, str]:
    # index = sum(ord(character) for character in name.lower()) % len(THEMES)
    theme = THEMES.get(name.capitalize())
    return theme 


def _status_from_pnl(pnl: float) -> str:
    if pnl > 0:
        return "up"
    if pnl < 0:
        return "down"
    return "flat"


def _personality_from_metrics(strategy: str, total_trades: int, win_rate: float) -> str:
    if strategy:
        if win_rate >= 60:
            return "confident"
        if win_rate >= 40:
            return "balanced"
        return "cautious"

    if total_trades == 0:
        return "observant"
    if win_rate >= 60:
        return "confident"
    if win_rate >= 40:
        return "measured"
    return "defensive"


def _build_trader_payload(name: str, account: dict[str, Any] | None = None) -> dict[str, Any]:
    account = account or read_account(name)
    raw_name = str(account.get("name", name)).strip() or name
    display_name = " ".join(part.capitalize() for part in raw_name.split())
    strategy = str(account.get("strategy", "") or "").strip()
    balance = float(account.get("balance", INITIAL_BALANCE) or 0.0)
    holdings = account.get("holdings", {}) or {}
    transactions = _normalize_transactions(account.get("transactions", []))
    history = account.get("portfolio_value_time_series", []) or []

    positions, win_counts = _build_position_state(transactions)

    holdings_payload: list[dict[str, Any]] = []
    portfolio_value = balance
    for symbol in sorted(holdings.keys()):
        shares = int(holdings.get(symbol, 0) or 0)
        if shares <= 0:
            continue

        position = positions.get(symbol.upper(), {"shares": 0.0, "cost_basis": 0.0})
        avg_price = position["cost_basis"] / position["shares"] if position["shares"] else 0.0
        current_price = _safe_share_price(symbol, fallback_price=avg_price)
        portfolio_value += current_price * shares

        holdings_payload.append(
            {
                "ticker": symbol.upper(),
                "shares": shares,
                "avgPrice": round(avg_price, 2),
                "currentPrice": round(current_price, 2),
            }
        )
    current_balance=round(history[-1][1]) if history else balance
   

    # current_balance = round(history[-1], 2)
    previous_balance = _previous_history_value(history)
    if previous_balance is None:
        previous_balance = current_balance

    pnl = round(current_balance - INITIAL_BALANCE, 2)
    pnl_percent = round((pnl / INITIAL_BALANCE) * 100, 2)
    total_trades = len(transactions)
    today = datetime.now().date()
    today_trades = sum(
        1
        for transaction in transactions
        if (parsed := _parse_timestamp(str(transaction.get("timestamp", "")))) and parsed.date() == today
    )

    sell_trades = sum(counts["closed_trades"] for counts in win_counts.values())
    win_trades = sum(counts["wins"] for counts in win_counts.values())
    win_rate = round((win_trades / sell_trades) * 100, 2) if sell_trades else 0.0

    recent_trades = []
    for transaction in transactions[-RECENT_TRADES_LIMIT:]:
        quantity = int(transaction.get("quantity", 0))
        recent_trades.append(
            {
                **transaction,
                "shares":transaction.get("quantity", 0),
                "time":transaction.get("timestamp", ""),
                "side": "buy" if quantity > 0 else "sell",
                "ticker": str(transaction.get("symbol", "")).upper(),
            }
        )

    activities = [
        {"time": timestamp, "type": event_type, "message": message}
        for timestamp, event_type, message in list(read_log(name, RECENT_ACTIVITIES_LIMIT))
    ]

    history_payload = [
        {"time": str(entry[0]), "balance": float(entry[1])}
        for entry in history
        if isinstance(entry, (list, tuple)) and len(entry) >= 2
    ]

    theme = _theme_for_name(raw_name)

    return {
        "currentBalance": current_balance,
        "previousBalance": round(float(previous_balance), 2),
        "balanceHistory": history_payload,
        "activities": activities,
        "status": _status_from_pnl(pnl),
        "pnl": pnl,
        "pnlPercent": pnl_percent,
        "recentTrades": recent_trades,
        "holdings": holdings_payload,
        "id": raw_name.lower(),
        "name": display_name,
        "role": _role_for_name(raw_name),
        "description": strategy or "Automated trader that manages a portfolio from persisted account state.",
        "color": theme["color"],
        "colorDim": theme["colorDim"],
        "colorRgb": theme["colorRgb"],
        "gradient": theme["gradient"],
        "initialBalance": INITIAL_BALANCE,
        "personality": _personality_from_metrics(strategy, total_trades, win_rate),
        "cash": round(balance, 2),
        "winRate": win_rate,
        "totalTrades": total_trades,
        "todayTrades": today_trades,
    }


@app.after_request
def _add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    return response


@app.route("/health", methods=["GET"])
def health() -> Any:
    return jsonify({"status": "ok"})


@app.route("/traders", methods=["GET"])
def traders() -> Any:
    names = _list_account_names()
    trader_payloads = [_build_trader_payload(name) for name in names]
    return jsonify(trader_payloads)


@app.route("/traders/<name>", methods=["GET"])
def trader_detail(name: str) -> Any:
    return jsonify(_build_trader_payload(name))


@app.route("/", methods=["GET"])
def index() -> Any:
    return jsonify({"message": "Trader API", "endpoints": ["/health", "/traders", "/traders/<name>"]})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)