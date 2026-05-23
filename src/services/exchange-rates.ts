/** Mesma origem — o Vite faz proxy para api.frankfurter.app (evita CORS). */
const API_BASE = "/api/frankfurter";

export const SUPPORTED_CURRENCIES = [
  "AUD",
  "BRL",
  "CAD",
  "CHF",
  "CNY",
  "CZK",
  "DKK",
  "EUR",
  "GBP",
  "HKD",
  "HUF",
  "IDR",
  "ILS",
  "INR",
  "ISK",
  "JPY",
  "KRW",
  "MXN",
  "MYR",
  "NOK",
  "NZD",
  "PHP",
  "PLN",
  "RON",
  "SEK",
  "SGD",
  "THB",
  "TRY",
  "USD",
  "ZAR",
] as const;

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export type TimeseriesResponse = {
  amount: number;
  base: string;
  start_date: string;
  end_date: string;
  rates: Record<string, Record<string, number>>;
};

export type GraphicPoint = {
  date: string;
  value: number;
};

export function getHistoryCacheKey(from: string, to: string): string {
  return `frankfurter:${from}:${to}`;
}

export function getDateRange(days = 30): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - days);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

export async function fetchLatestRate(
  from: SupportedCurrency,
  to: SupportedCurrency
): Promise<number> {
  const response = await fetch(
    `${API_BASE}/latest?from=${from}&to=${to}`
  );

  if (!response.ok) {
    throw new Error("Falha ao buscar cotação atual.");
  }

  const data = (await response.json()) as {
    rates: Record<string, number>;
  };

  const rate = data.rates[to];
  if (typeof rate !== "number") {
    throw new Error("Cotação indisponível para este par.");
  }

  return rate;
}

export async function fetchTimeseries(
  from: SupportedCurrency,
  to: SupportedCurrency,
  start: string,
  end: string
): Promise<TimeseriesResponse> {
  const response = await fetch(
    `${API_BASE}/${start}..${end}?from=${from}&to=${to}`
  );

  if (!response.ok) {
    throw new Error("Falha ao buscar histórico de cotações.");
  }

  return response.json() as Promise<TimeseriesResponse>;
}

export function mapTimeseriesToGraphic(
  rates: TimeseriesResponse["rates"],
  target: SupportedCurrency
): GraphicPoint[] {
  return Object.keys(rates)
    .sort()
    .map((date) => ({
      date,
      value: rates[date][target] ?? 0,
    }))
    .filter((point) => point.value > 0);
}

export function isTimeseriesCacheValid(
  cached: TimeseriesResponse,
  from: SupportedCurrency,
  to: SupportedCurrency,
  expectedEndDate: string
): boolean {
  if (cached.base !== from || cached.end_date !== expectedEndDate) {
    return false;
  }
  const sampleDate = Object.keys(cached.rates)[0];
  if (!sampleDate) return false;
  return typeof cached.rates[sampleDate][to] === "number";
}
