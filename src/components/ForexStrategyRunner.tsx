import { useState, useEffect } from "react";
import { StrategySelector } from "./StrategySelector";
import { PriceChart } from "./PriceChart";
import { SignalLogs } from "./SignalLogs";
import { CurrentSignal } from "./CurrentSignal";
import { PredictionPanel } from "./PredictionPanel";
import { Card } from "./ui/card";
import { generateSignal, updatePriceData, STRATEGIES } from "../utils/tradingLogic";
import { fetchLatestPrice } from "../utils/forexApi";
import type { Signal, PricePoint } from "../types/trading";

export function ForexStrategyRunner() {
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>(["EMA_CROSSOVER"]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [currentSignal, setCurrentSignal] = useState<Signal | null>(null);
  const [priceData, setPriceData] = useState<PricePoint[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [prediction, setPrediction] = useState<"BULLISH" | "BEARISH" | "NEUTRAL">("NEUTRAL");
  const [priceError, setPriceError] = useState<string | null>(null);

  // Fetch and update price data in real-time
  useEffect(() => {
    let isMounted = true;

    const refreshPrice = async () => {
      try {
        const latest = await fetchLatestPrice("EUR", "USD");
        if (!isMounted) return;

        setPriceError(null);
        setCurrentPrice(latest);
        setPriceData((prev) => updatePriceData(prev, latest, new Date()));
      } catch (error) {
        if (!isMounted) return;
        console.error("Failed to fetch latest price", error);
        setPriceError(error instanceof Error ? error.message : "Unable to load price data");
      }
    };

    refreshPrice();
    const interval = setInterval(refreshPrice, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Generate signals based on selected strategies
  useEffect(() => {
    if (currentPrice === null) return;

    const interval = setInterval(() => {
      if (selectedStrategies.length === 0) return;

      // Random chance to generate a signal (20%)
      if (Math.random() < 0.2) {
        const randomStrategy = selectedStrategies[Math.floor(Math.random() * selectedStrategies.length)];
        const strategy = STRATEGIES.find((s) => s.id === randomStrategy);
        
        if (strategy) {
          const signal = generateSignal(strategy, currentPrice);
          setSignals((prev) => [signal, ...prev]);
          setCurrentSignal(signal);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedStrategies, currentPrice]);

  // Update signal statuses based on price movement
  useEffect(() => {
    if (currentPrice === null) return;

    setSignals((prevSignals) =>
      prevSignals.map((signal) => {
        if (signal.status !== "OPEN") return signal;

        const priceDiff = currentPrice - signal.entry;
        const targetDiff = signal.target - signal.entry;
        const stopDiff = signal.stop - signal.entry;

        // Check if target hit
        if (signal.side === "BUY" && currentPrice >= signal.target) {
          const pnl = ((signal.target - signal.entry) / signal.entry) * 100;
          return { ...signal, status: "CLOSED" as const, result: "WIN" as const, pnl };
        }
        if (signal.side === "SELL" && currentPrice <= signal.target) {
          const pnl = ((signal.entry - signal.target) / signal.entry) * 100;
          return { ...signal, status: "CLOSED" as const, result: "WIN" as const, pnl };
        }

        // Check if stop hit
        if (signal.side === "BUY" && currentPrice <= signal.stop) {
          const pnl = ((signal.stop - signal.entry) / signal.entry) * 100;
          return { ...signal, status: "CLOSED" as const, result: "LOSS" as const, pnl };
        }
        if (signal.side === "SELL" && currentPrice >= signal.stop) {
          const pnl = ((signal.entry - signal.stop) / signal.entry) * 100;
          return { ...signal, status: "CLOSED" as const, result: "LOSS" as const, pnl };
        }

        return signal;
      })
    );
  }, [currentPrice]);

  // Update prediction based on signals
  useEffect(() => {
    const recentSignals = signals.slice(0, 5);
    if (recentSignals.length === 0) {
      setPrediction("NEUTRAL");
      return;
    }

    const buySignals = recentSignals.filter((s) => s.side === "BUY").length;
    const sellSignals = recentSignals.filter((s) => s.side === "SELL").length;

    if (buySignals > sellSignals * 1.5) {
      setPrediction("BULLISH");
    } else if (sellSignals > buySignals * 1.5) {
      setPrediction("BEARISH");
    } else {
      setPrediction("NEUTRAL");
    }
  }, [signals]);

  const handleStrategyToggle = (strategyId: string) => {
    setSelectedStrategies((prev) =>
      prev.includes(strategyId)
        ? prev.filter((id) => id !== strategyId)
        : [...prev, strategyId]
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-[1800px] mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1>Forex Strategy Runner</h1>
            <p className="text-muted-foreground">Real-time trading signals and market analysis</p>
          </div>
          <div className="text-right">
            <div className="text-muted-foreground">EUR/USD</div>
            <div className="text-2xl">
              {currentPrice !== null ? currentPrice.toFixed(5) : "Loading..."}
            </div>
            {priceError && <p className="text-xs text-destructive">{priceError}</p>}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Sidebar - Strategy Selection */}
          <div className="lg:col-span-3">
            <Card className="p-4">
              <StrategySelector
                strategies={STRATEGIES}
                selectedStrategies={selectedStrategies}
                onToggle={handleStrategyToggle}
              />
            </Card>
          </div>

          {/* Center - Chart and Signals */}
          <div className="lg:col-span-6 space-y-4">
            <PriceChart
              data={priceData}
              signals={signals.filter((s) => s.status === "OPEN")}
              currentPrice={currentPrice}
            />

            {currentSignal && currentPrice !== null && (
              <CurrentSignal signal={currentSignal} currentPrice={currentPrice} />
            )}
          </div>

          {/* Right Sidebar - Prediction */}
          <div className="lg:col-span-3">
            <PredictionPanel
              prediction={prediction}
              signals={signals}
            />
          </div>
        </div>

        {/* Signal Logs Table */}
        <SignalLogs signals={signals} />
      </div>
    </div>
  );
}
