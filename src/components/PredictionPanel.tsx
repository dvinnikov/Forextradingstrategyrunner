import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";
import type { Signal } from "../types/trading";

interface PredictionPanelProps {
  prediction: "BULLISH" | "BEARISH" | "NEUTRAL";
  signals: Signal[];
  currentPrice: number;
}

export function PredictionPanel({ prediction, signals }: PredictionPanelProps) {
  const openSignals = signals.filter((s) => s.status === "OPEN");
  const closedSignals = signals.filter((s) => s.status === "CLOSED");
  const wins = closedSignals.filter((s) => s.result === "WIN").length;
  const losses = closedSignals.filter((s) => s.result === "LOSS").length;
  const winRate = closedSignals.length > 0 ? ((wins / closedSignals.length) * 100).toFixed(1) : "0.0";
  
  const totalPnl = closedSignals.reduce((sum, s) => sum + s.pnl, 0);

  const predictionConfig = {
    BULLISH: {
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      label: "Bullish",
    },
    BEARISH: {
      icon: TrendingDown,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      label: "Bearish",
    },
    NEUTRAL: {
      icon: Minus,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      label: "Neutral",
    },
  };

  const config = predictionConfig[prediction];
  const Icon = config.icon;

  return (
    <Card className="p-4 space-y-4">
      <div>
        <h3>Market Prediction</h3>
        <p className="text-muted-foreground text-sm">Overall sentiment analysis</p>
      </div>

      <div className={`${config.bgColor} rounded-lg p-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <Icon className={`w-8 h-8 ${config.color}`} />
          <div>
            <p className="text-sm text-muted-foreground">Market Trend</p>
            <p className={`text-xl ${config.color}`}>{config.label}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-muted-foreground" />
          <h4 className="text-sm">Statistics</h4>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Open Signals</span>
            <Badge variant="outline">{openSignals.length}</Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Signals</span>
            <span className="text-sm">{signals.length}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Win Rate</span>
            <span className={`text-sm ${parseFloat(winRate) >= 50 ? "text-green-500" : "text-red-500"}`}>
              {winRate}%
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Wins / Losses</span>
            <span className="text-sm">
              <span className="text-green-500">{wins}</span> / <span className="text-red-500">{losses}</span>
            </span>
          </div>

          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total P&L</span>
              <span className={`${totalPnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                {totalPnl >= 0 ? "+" : ""}{totalPnl.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t space-y-2">
        <h4 className="text-sm">Recent Activity</h4>
        <div className="space-y-1">
          {signals.slice(0, 3).map((signal) => (
            <div key={signal.id} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{signal.strategy}</span>
              <Badge variant={signal.side === "BUY" ? "default" : "secondary"} className="text-xs h-5">
                {signal.side}
              </Badge>
            </div>
          ))}
          {signals.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-2">No signals yet</p>
          )}
        </div>
      </div>
    </Card>
  );
}
