import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import type { Strategy } from "../types/trading";

interface StrategySelectorProps {
  strategies: Strategy[];
  selectedStrategies: string[];
  onToggle: (strategyId: string) => void;
}

export function StrategySelector({
  strategies,
  selectedStrategies,
  onToggle,
}: StrategySelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3>Trading Strategies</h3>
        <p className="text-muted-foreground text-sm">Select strategies to run</p>
      </div>

      <div className="space-y-3">
        {strategies.map((strategy) => (
          <div key={strategy.id} className="flex items-start space-x-3">
            <Checkbox
              id={strategy.id}
              checked={selectedStrategies.includes(strategy.id)}
              onCheckedChange={() => onToggle(strategy.id)}
            />
            <div className="flex-1 space-y-1">
              <Label
                htmlFor={strategy.id}
                className="cursor-pointer flex items-center gap-2"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: strategy.color }}
                />
                {strategy.name}
              </Label>
              <p className="text-xs text-muted-foreground">{strategy.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t">
        <div className="text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Active Strategies:</span>
            <span>{selectedStrategies.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
