import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, Target, Shield } from "lucide-react";
import type { Signal } from "../types/trading";

interface CurrentSignalProps {
  signal: Signal;
  currentPrice: number;
}

export function CurrentSignal({ signal, currentPrice }: CurrentSignalProps) {
  const priceDiff = currentPrice - signal.entry;
  const pnlPips = (priceDiff * 10000).toFixed(1);
  const pnlPercent = ((priceDiff / signal.entry) * 100).toFixed(2);

  return (
    <Card className="p-4 border-2 border-primary/20">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4>Latest Signal</h4>
            <p className="text-muted-foreground text-sm">{signal.time}</p>
          </div>
          <Badge variant={signal.side === "BUY" ? "default" : "secondary"}>
            {signal.side === "BUY" ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {signal.side}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Strategy</p>
            <p>{signal.strategy}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <Badge variant={signal.status === "OPEN" ? "outline" : "secondary"}>
              {signal.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Entry</p>
            <p className="text-sm">{signal.entry.toFixed(5)}</p>
          </div>
          <div className="flex items-start gap-1">
            <Shield className="w-3 h-3 text-red-500 mt-1" />
            <div>
              <p className="text-xs text-muted-foreground">Stop</p>
              <p className="text-sm text-red-500">{signal.stop.toFixed(5)}</p>
            </div>
          </div>
          <div className="flex items-start gap-1">
            <Target className="w-3 h-3 text-green-500 mt-1" />
            <div>
              <p className="text-xs text-muted-foreground">Target</p>
              <p className="text-sm text-green-500">{signal.target.toFixed(5)}</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Unrealized P&L</p>
            <div className="text-right">
              <p className={priceDiff >= 0 ? "text-green-500" : "text-red-500"}>
                {priceDiff >= 0 ? "+" : ""}{pnlPips} pips
              </p>
              <p className={`text-sm ${priceDiff >= 0 ? "text-green-500" : "text-red-500"}`}>
                {priceDiff >= 0 ? "+" : ""}{pnlPercent}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
