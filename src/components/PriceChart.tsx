import { Card } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import type { PricePoint, Signal } from "../types/trading";

interface PriceChartProps {
  data: PricePoint[];
  signals: Signal[];
  currentPrice: number;
}

export function PriceChart({ data, signals, currentPrice }: PriceChartProps) {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <h3>EUR/USD Price Chart</h3>
          <p className="text-muted-foreground text-sm">Real-time price movement with targets</p>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="time"
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                domain={['auto', 'auto']}
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => value.toFixed(5)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--popover)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'var(--foreground)' }}
                formatter={(value: number) => value.toFixed(5)}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
              
              {/* Current price line */}
              <ReferenceLine
                y={currentPrice}
                stroke="var(--foreground)"
                strokeDasharray="3 3"
                label={{
                  value: `Current: ${currentPrice.toFixed(5)}`,
                  position: 'right',
                  fill: 'var(--foreground)',
                  fontSize: 12,
                }}
              />

              {/* Target and Stop lines for open signals */}
              {signals.map((signal) => (
                <g key={signal.id}>
                  <ReferenceLine
                    y={signal.target}
                    stroke="#10b981"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    label={{
                      value: `T: ${signal.target.toFixed(5)}`,
                      position: 'right',
                      fill: '#10b981',
                      fontSize: 11,
                    }}
                  />
                  <ReferenceLine
                    y={signal.stop}
                    stroke="#ef4444"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    label={{
                      value: `S: ${signal.stop.toFixed(5)}`,
                      position: 'right',
                      fill: '#ef4444',
                      fontSize: 11,
                    }}
                  />
                  <ReferenceLine
                    y={signal.entry}
                    stroke={signal.side === "BUY" ? "#3b82f6" : "#f59e0b"}
                    strokeWidth={1}
                    label={{
                      value: `Entry: ${signal.entry.toFixed(5)}`,
                      position: 'left',
                      fill: 'var(--muted-foreground)',
                      fontSize: 10,
                    }}
                  />
                </g>
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center gap-4 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-[#10b981]" />
            <span className="text-muted-foreground">Target</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-[#ef4444]" />
            <span className="text-muted-foreground">Stop Loss</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-[#3b82f6]" />
            <span className="text-muted-foreground">Buy Entry</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-[#f59e0b]" />
            <span className="text-muted-foreground">Sell Entry</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
