import type { Strategy, Signal, PricePoint } from "../types/trading";

export const STRATEGIES: Strategy[] = [
  {
    id: "EMA_CROSSOVER",
    name: "EMA Crossover",
    description: "Fast EMA crosses slow EMA",
    color: "#3b82f6",
  },
  {
    id: "RSI_DIVERGENCE",
    name: "RSI Divergence",
    description: "RSI shows divergence from price",
    color: "#10b981",
  },
  {
    id: "MACD_SIGNAL",
    name: "MACD Signal",
    description: "MACD crosses signal line",
    color: "#f59e0b",
  },
  {
    id: "BOLLINGER_BOUNCE",
    name: "Bollinger Bounce",
    description: "Price bounces off Bollinger bands",
    color: "#8b5cf6",
  },
  {
    id: "SUPPORT_RESISTANCE",
    name: "Support/Resistance",
    description: "Key level breakout or bounce",
    color: "#ec4899",
  },
  {
    id: "TREND_FOLLOW",
    name: "Trend Following",
    description: "Follow the dominant trend",
    color: "#06b6d4",
  },
];

export function generateSignal(strategy: Strategy, currentPrice: number): Signal {
  const side: "BUY" | "SELL" = Math.random() > 0.5 ? "BUY" : "SELL";
  const entry = currentPrice + (Math.random() - 0.5) * 0.0010;
  
  let stop: number;
  let target: number;
  
  if (side === "BUY") {
    stop = entry - (0.0020 + Math.random() * 0.0010);
    target = entry + (0.0030 + Math.random() * 0.0020);
  } else {
    stop = entry + (0.0020 + Math.random() * 0.0010);
    target = entry - (0.0030 + Math.random() * 0.0020);
  }

  const now = new Date();
  
  return {
    id: `${strategy.id}-${Date.now()}-${Math.random()}`,
    time: now.toLocaleTimeString(),
    timestamp: now.getTime(),
    strategy: strategy.name,
    side,
    entry: parseFloat(entry.toFixed(5)),
    stop: parseFloat(stop.toFixed(5)),
    target: parseFloat(target.toFixed(5)),
    status: "OPEN",
    result: "-",
    pnl: 0,
  };
}

export function updatePriceData(
  currentData: PricePoint[],
  lastPrice: number
): PricePoint[] {
  const now = new Date();
  const timeStr = now.toLocaleTimeString();

  // Random price movement
  const change = (Math.random() - 0.5) * 0.0002;
  const newPrice = lastPrice + change;

  const open = currentData.length > 0 ? currentData[currentData.length - 1].close : newPrice;
  const high = Math.max(open, newPrice) + Math.random() * 0.0001;
  const low = Math.min(open, newPrice) - Math.random() * 0.0001;

  const newPoint: PricePoint = {
    time: timeStr,
    price: parseFloat(newPrice.toFixed(5)),
    open: parseFloat(open.toFixed(5)),
    high: parseFloat(high.toFixed(5)),
    low: parseFloat(low.toFixed(5)),
    close: parseFloat(newPrice.toFixed(5)),
  };

  const newData = [...currentData, newPoint];
  
  // Keep last 50 points
  return newData.slice(-50);
}
