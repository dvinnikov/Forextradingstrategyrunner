import { useState, useEffect } from "react";
import { StrategySelector } from "./StrategySelector";
import { PriceChart } from "./PriceChart";
import { SignalLogs } from "./SignalLogs";
import { CurrentSignal } from "./CurrentSignal";
import { PredictionPanel } from "./PredictionPanel";
import { Card } from "./ui/card";
import { generateSignal, updatePriceData, STRATEGIES } from "../utils/tradingLogic";
import type { Signal, PricePoint, Strategy } from "../types/trading";

export function ForexStrategyRunner() {
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>(["EMA_CROSSOVER"]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [currentSignal, setCurrentSignal] = useState<Signal | null>(null);
  const [priceData, setPriceData] = useState<PricePoint[]>([]);
  const [currentPrice, setCurrentPrice] = useState(1.0850);
  const [prediction, setPrediction] = useState<"BULLISH" | "BEARISH" | "NEUTRAL">("NEUTRAL");

  // Initialize price data
  useEffect(() => {
    const initialData = updatePriceData([], 1.0850);
    setPriceData(initialData);
  }, []);

  // Update price data in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setPriceData((prev) => {
        const newData = updatePriceData(prev, currentPrice);
        const latestPrice = newData[newData.length - 1].close;
        setCurrentPrice(latestPrice);
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [currentPrice]);

  // Generate signals based on selected strategies
  useEffect(() => {
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
            <div className="text-2xl">{currentPrice.toFixed(5)}</div>
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
              signals={signals.filter(s => s.status === "OPEN")}
              currentPrice={currentPrice}
            />
            
            {currentSignal && (
              <CurrentSignal signal={currentSignal} currentPrice={currentPrice} />
            )}
          </div>

          {/* Right Sidebar - Prediction */}
          <div className="lg:col-span-3">
            <PredictionPanel 
              prediction={prediction} 
              signals={signals}
              currentPrice={currentPrice}
            />
          </div>
        </div>

        {/* Signal Logs Table */}
        <SignalLogs signals={signals} />
      </div>
    </div>
  );
}
