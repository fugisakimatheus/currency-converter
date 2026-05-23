import {
  getHistoryCacheKey,
  isTimeseriesCacheValid,
  SupportedCurrency,
  TimeseriesResponse,
} from "./exchange-rates";

export function readTimeseriesCache(
  from: SupportedCurrency,
  to: SupportedCurrency,
  expectedEndDate: string
): TimeseriesResponse | null {
  const cacheKey = getHistoryCacheKey(from, to);
  const cachedRaw = localStorage.getItem(cacheKey);
  if (!cachedRaw) return null;

  try {
    const cached = JSON.parse(cachedRaw) as TimeseriesResponse;
    if (!isTimeseriesCacheValid(cached, from, to, expectedEndDate)) {
      return null;
    }
    return cached;
  } catch {
    localStorage.removeItem(cacheKey);
    return null;
  }
}

export function writeTimeseriesCache(
  from: SupportedCurrency,
  to: SupportedCurrency,
  data: TimeseriesResponse
): void {
  localStorage.setItem(getHistoryCacheKey(from, to), JSON.stringify(data));
}
