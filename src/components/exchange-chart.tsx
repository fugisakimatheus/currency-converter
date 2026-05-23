import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import type { GraphicData } from "../contexts/currency";
import { formatRateDisplay } from "../lib/format";
import type { Theme } from "../contexts/theme";

type ExchangeChartProps = {
  fromCurrency: string;
  toCurrency: string;
  graphicData: GraphicData[];
  isLoading: boolean;
  error: string | null;
  theme: Theme;
};

export function ExchangeChart({
  fromCurrency,
  toCurrency,
  graphicData,
  isLoading,
  error,
  theme,
}: ExchangeChartProps) {
  const isDark = theme === "dark";

  const series = useMemo(
    () => [
      {
        name: `Cotação ${fromCurrency} → ${toCurrency}`,
        data: graphicData.map((item) => [
          new Date(item.date).getTime(),
          item.value,
        ]),
      },
    ],
    [fromCurrency, toCurrency, graphicData]
  );

  const chartOptions = useMemo(
    () => ({
      chart: {
        type: "area" as const,
        toolbar: { show: false },
        background: "transparent",
        fontFamily: "Roboto, sans-serif",
      },
      colors: ["#818cf8"],
      dataLabels: { enabled: false },
      stroke: { curve: "smooth" as const, width: 2 },
      grid: {
        borderColor: isDark
          ? "rgba(148, 163, 184, 0.12)"
          : "rgba(99, 102, 241, 0.12)",
        strokeDashArray: 4,
      },
      yaxis: {
        tickAmount: 5,
        labels: {
          style: {
            colors: isDark ? "#94a3b8" : "#64748b",
          },
          formatter: (labelValue: number) => formatRateDisplay(labelValue),
        },
      },
      xaxis: {
        type: "datetime" as const,
        labels: { show: false },
        tooltip: { enabled: false },
        axisTicks: { show: false },
        axisBorder: { show: false },
      },
      fill: {
        type: "gradient" as const,
        gradient: {
          shadeIntensity: 1,
          opacityFrom: isDark ? 0.45 : 0.35,
          opacityTo: 0.05,
          stops: [0, 100],
        },
      },
      tooltip: {
        theme: isDark ? "dark" : "light",
        custom: function ({
          series: chartSeries,
          seriesIndex,
          dataPointIndex,
          w,
        }: {
          series: number[][];
          seriesIndex: number;
          dataPointIndex: number;
          w: { globals: { seriesX: number[][] } };
        }) {
          const value = formatRateDisplay(
            Number(chartSeries[seriesIndex][dataPointIndex])
          );

          const dateLabel = new Date(
            w.globals.seriesX[seriesIndex][dataPointIndex]
          )
            .toLocaleDateString("pt-BR", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })
            .replace(/\./g, "");

          return `
            <div class="apex-tooltip-custom px-3 py-2">
              <div class="text-sm font-semibold text-indigo-500">${value}</div>
              <div class="text-xs text-slate-500">${dateLabel}</div>
            </div>
          `;
        },
      },
    }),
    [isDark]
  );

  if (isLoading) {
    return (
      <div className="glass-chart-placeholder mt-4 flex h-[220px] flex-col items-center justify-center sm:h-[300px]">
        <AiOutlineLoading3Quarters
          className="animate-spin text-indigo-500 dark:text-indigo-400"
          size={40}
        />
        <span className="mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-300">
          Carregando informações
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-chart-placeholder mt-4 flex h-[220px] items-center justify-center px-6 text-center text-sm text-slate-600 dark:text-slate-400 sm:h-[300px]">
        {error}
      </div>
    );
  }

  if (graphicData.length === 0) {
    return (
      <div className="glass-chart-placeholder mt-4 flex h-[220px] items-center justify-center px-6 text-center text-sm text-slate-600 dark:text-slate-400 sm:h-[300px]">
        Sem dados de cotação para este par de moedas.
      </div>
    );
  }

  return (
    <div className="mt-2 -mx-2">
      <ReactApexChart
        key={theme}
        options={chartOptions}
        series={series}
        type="area"
        height={280}
        width="100%"
      />
    </div>
  );
}
