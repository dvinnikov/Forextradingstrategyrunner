import { useEffect, useRef } from "react";
import { Card } from "./ui/card";
import type { PricePoint, Signal } from "../types/trading";

declare global {
  interface Window {
    TradingView?: {
      widget?: (config: Record<string, unknown>) => void;
    };
  }
}

interface PriceChartProps {
  data: PricePoint[];
  signals: Signal[];
  currentPrice: number;
}

export function PriceChart({ data, signals, currentPrice }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const widgetContainerIdRef = useRef(
    `tradingview_${Math.random().toString(36).slice(2)}`,
  );

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    container.innerHTML = "";
    const widgetContainer = document.createElement("div");
    widgetContainer.id = widgetContainerIdRef.current;
    widgetContainer.style.height = "100%";
    widgetContainer.style.width = "100%";
    container.appendChild(widgetContainer);

    const createWidget = () => {
      if (!window.TradingView?.widget) return;

      window.TradingView.widget({
        autosize: true,
        symbol: "OANDA:EURUSD",
        interval: "30",
        timezone: "Etc/UTC",
        theme: document.documentElement.classList.contains("dark")
          ? "dark"
          : "light",
        style: "1",
        locale: "en",
        container_id: widgetContainerIdRef.current,
        allow_symbol_change: false,
        hide_side_toolbar: false,
        hide_top_toolbar: false,
        backgroundColor: "transparent",
      });
    };

    const scriptId = "tradingview-widget-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (window.TradingView?.widget) {
      createWidget();
    } else {
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.async = true;
        document.head.appendChild(script);
      }

      const handleLoad = () => createWidget();
      script.addEventListener("load", handleLoad, { once: true });

      return () => {
        script?.removeEventListener("load", handleLoad);
        container.innerHTML = "";
      };
    }

    return () => {
      container.innerHTML = "";
    };
  }, []);

  const lastPoint = data[data.length - 1];

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <h3>EUR/USD Price Chart</h3>
          <p className="text-muted-foreground text-sm">
            Streaming data provided by TradingView
          </p>
          {lastPoint && (
            <p className="text-muted-foreground text-xs mt-1">
              Last update: {lastPoint.time}
            </p>
          )}
        </div>

        <div className="h-[400px]" ref={chartContainerRef} />

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current price</span>
            <span className="font-medium">{currentPrice.toFixed(5)}</span>
          </div>
          {signals.length > 0 ? (
            <div className="grid gap-2 md:grid-cols-2">
              {signals.map((signal) => (
                <div
                  key={signal.id}
                  className="rounded-lg border border-border/60 p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{signal.strategy}</p>
                      <p className="text-xs text-muted-foreground">
                        {signal.side} · {signal.time}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        signal.side === "BUY"
                          ? "text-emerald-500"
                          : "text-amber-500"
                      }`}
                    >
                      {signal.side}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Entry</p>
                      <p className="font-medium">
                        {signal.entry.toFixed(5)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Target</p>
                      <p className="font-medium text-emerald-500">
                        {signal.target.toFixed(5)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Stop</p>
                      <p className="font-medium text-rose-500">
                        {signal.stop.toFixed(5)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No open signal levels to display.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
