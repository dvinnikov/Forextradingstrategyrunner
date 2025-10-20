const BASE_URL = "https://api.exchangerate.host";

export async function fetchLatestPrice(base: string, quote: string): Promise<number> {
  const normalizedBase = base.toUpperCase();
  const normalizedQuote = quote.toUpperCase();
  const url = `${BASE_URL}/latest?base=${encodeURIComponent(normalizedBase)}&symbols=${encodeURIComponent(normalizedQuote)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${normalizedBase}/${normalizedQuote} price: ${response.status}`);
  }

  const data = await response.json();

  if (data?.success === false) {
    const errorInfo = (data as { error?: { type?: unknown } }).error;
    const errorType = typeof errorInfo?.type === "string" ? errorInfo.type : "unknown";
    throw new Error(`Forex price request failed: ${errorType}`);
  }
  const rates = data?.rates;

  if (!rates || typeof rates !== "object") {
    throw new Error("Received malformed forex price response");
  }

  const matchedKey = Object.keys(rates).find(
    (symbol) => symbol.toUpperCase() === normalizedQuote
  );

  const rawRate = matchedKey ? (rates as Record<string, unknown>)[matchedKey] : undefined;
  const rate = typeof rawRate === "string" ? parseFloat(rawRate) : rawRate;

  if (typeof rate !== "number" || Number.isNaN(rate)) {
    throw new Error("Received malformed forex price response");
  }

  return rate;
}
