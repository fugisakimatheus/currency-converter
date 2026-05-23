import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchLatestRate,
  fetchTimeseries,
  getDateRange,
  GraphicPoint,
  mapTimeseriesToGraphic,
  SupportedCurrency,
} from "../services/exchange-rates";
import {
  readTimeseriesCache,
  writeTimeseriesCache,
} from "../services/exchange-rates-cache";

type UseCurrencyPairResult = {
  graphicData: GraphicPoint[];
  rate: number;
  isLoadingGraph: boolean;
  graphError: string | null;
};

export function useCurrencyPair(
  fromCurrency: SupportedCurrency,
  toCurrency: SupportedCurrency
): UseCurrencyPairResult {
  const [graphicData, setGraphicData] = useState<GraphicPoint[]>([]);
  const [rate, setRate] = useState(0);
  const [isLoadingGraph, setIsLoadingGraph] = useState(false);
  const [graphError, setGraphError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const loadPairData = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    const { from, to } = getDateRange(30);

    const cached = readTimeseriesCache(fromCurrency, toCurrency, to);
    if (cached) {
      const points = mapTimeseriesToGraphic(cached.rates, toCurrency);
      if (requestId !== requestIdRef.current) return;

      const lastPoint = points[points.length - 1];
      setRate(lastPoint?.value ?? 0);
      setGraphicData(points);
      setGraphError(null);
      setIsLoadingGraph(false);
      return;
    }

    setIsLoadingGraph(true);
    setGraphError(null);

    try {
      const [latestRate, timeseries] = await Promise.all([
        fetchLatestRate(fromCurrency, toCurrency),
        fetchTimeseries(fromCurrency, toCurrency, from, to),
      ]);

      if (requestId !== requestIdRef.current) return;

      writeTimeseriesCache(fromCurrency, toCurrency, timeseries);
      const points = mapTimeseriesToGraphic(timeseries.rates, toCurrency);

      setRate(latestRate);
      setGraphicData(points);
      setGraphError(null);
    } catch {
      if (requestId !== requestIdRef.current) return;
      setRate(0);
      setGraphicData([]);
      setGraphError("Não foi possível carregar o histórico de cotações.");
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoadingGraph(false);
      }
    }
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    loadPairData();
  }, [loadPairData]);

  return { graphicData, rate, isLoadingGraph, graphError };
}
