import { Card } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import type { Signal } from "../types/trading";

interface SignalLogsProps {
  signals: Signal[];
}

export function SignalLogs({ signals }: SignalLogsProps) {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <h3>Signal Logs</h3>
          <p className="text-muted-foreground text-sm">Complete history of all trading signals</p>
        </div>

        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Strategy</TableHead>
                <TableHead>Side</TableHead>
                <TableHead>Entry</TableHead>
                <TableHead>Stop</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Result</TableHead>
                <TableHead className="text-right">P&L</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {signals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground h-32">
                    No signals yet. Signals will appear as strategies generate them.
                  </TableCell>
                </TableRow>
              ) : (
                signals.map((signal) => (
                  <TableRow key={signal.id}>
                    <TableCell className="text-sm">{signal.time}</TableCell>
                    <TableCell className="text-sm">{signal.strategy}</TableCell>
                    <TableCell>
                      <Badge variant={signal.side === "BUY" ? "default" : "secondary"}>
                        {signal.side}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{signal.entry.toFixed(5)}</TableCell>
                    <TableCell className="text-sm text-red-500">{signal.stop.toFixed(5)}</TableCell>
                    <TableCell className="text-sm text-green-500">{signal.target.toFixed(5)}</TableCell>
                    <TableCell>
                      <Badge variant={signal.status === "OPEN" ? "outline" : "secondary"}>
                        {signal.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {signal.result === "WIN" && (
                        <Badge className="bg-green-500 hover:bg-green-600">WIN</Badge>
                      )}
                      {signal.result === "LOSS" && (
                        <Badge variant="destructive">LOSS</Badge>
                      )}
                      {signal.result === "-" && (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {signal.pnl !== 0 ? (
                        <span className={signal.pnl >= 0 ? "text-green-500" : "text-red-500"}>
                          {signal.pnl >= 0 ? "+" : ""}{signal.pnl.toFixed(2)}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </Card>
  );
}
