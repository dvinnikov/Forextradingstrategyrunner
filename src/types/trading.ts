export interface Strategy {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface Signal {
  id: string;
  time: string;
  timestamp: number;
  strategy: string;
  side: "BUY" | "SELL";
  entry: number;
  stop: number;
  target: number;
  status: "OPEN" | "CLOSED";
  result: "WIN" | "LOSS" | "-";
  pnl: number;
}

export interface PricePoint {
  time: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
}
