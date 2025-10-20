# Forex Trading Strategy Runner

This project renders a real-time foreign exchange trading dashboard. It streams live quotes for a configured currency pair, drives a basic trading strategy, and visualizes the resulting positions and price history.

The original design reference is available on Figma: https://www.figma.com/design/VzjwiYLOxjMSX60tFoYpxB/Forex-Trading-Strategy-Runner.

## Requirements

- [Node.js](https://nodejs.org/) 18 or newer
- [npm](https://www.npmjs.com/) 9 or newer

The live price feed is powered by [exchangerate.host](https://exchangerate.host/). This provider offers free, no-authentication access to latest foreign exchange rates, so **no API key is required**. If you choose to swap in a different data source later, add your credentials to a `.env` file at the project root and expose them through Vite using the `VITE_` prefix (for example, `VITE_FOREX_API_KEY`).

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. (Optional) Create a `.env` file to override the default base/quote symbols or to configure alternate providers. The application currently supports the following environment variables:

   ```bash
   # Default symbols for the price stream
   VITE_FOREX_BASE=EUR
   VITE_FOREX_QUOTE=USD

   # Optional: custom API endpoint for an alternative provider
   VITE_FOREX_API_URL=https://api.exchangerate.host/latest

   # Optional: API key if required by your provider (unused by exchangerate.host)
   VITE_FOREX_API_KEY=your-api-key
   ```

## Running the Application

Start the Vite development server:

```bash
npm run dev
```

Vite will display a local URL (typically `http://localhost:5173/`). Open that URL in your browser to interact with the dashboard. The page will begin fetching live forex prices immediately and update charts and panels as ticks arrive.

## Production Build

To create an optimized production build, run:

```bash
npm run build
```

You can preview the built assets locally with:

```bash
npm run preview
```

## Troubleshooting

- Ensure your network allows outgoing HTTPS requests to `exchangerate.host`.
- If you change the base or quote symbol via environment variables, confirm the provider supports that currency pair.
- When switching providers, update `VITE_FOREX_API_URL` and ensure any necessary authentication parameters (such as `VITE_FOREX_API_KEY`) are respected by the fetch logic in `src/utils/forexApi.ts`.
