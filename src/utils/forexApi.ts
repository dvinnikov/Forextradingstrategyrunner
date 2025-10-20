const BASE_URL = "https://api.exchangerate.host";

export async function fetchLatestPrice(base: string, quote: string): Promise<number> {
  const url = `${BASE_URL}/latest?base=${encodeURIComponent(base)}&symbols=${encodeURIComponent(quote)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${base}/${quote} price: ${response.status}`);
  }

  const data = await response.json();
  const rate = data?.rates?.[quote];

  if (typeof rate !== "number") {
    throw new Error("Received malformed forex price response");
  }

  return rate;
}
