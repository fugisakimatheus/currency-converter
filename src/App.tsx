import { CurrencyInput } from "./components/input";
import { FaExchangeAlt } from "react-icons/fa";
import { useCurrency } from "./contexts/currency";
import ReactApexChart from "react-apexcharts";

function App() {
  const {
    amount,
    setAmount,
    exchangeAmount,
    fromCurrency,
    toCurrency,
    setFromCurrency,
    setToCurrency,
    handleInverse,
    graphicData,
  } = useCurrency();

  const series = [
    {
      name: `Cotação ${fromCurrency} para ${toCurrency}`,
      data: graphicData.map((item) => [
        new Date(item.date).getTime(),
        item.value,
      ]),
    },
  ];

  const chartOptions: any = {
    chart: {
      type: "area",
      toolbar: {
        show: false,
      },
    },
    colors: ["rgb(99, 102, 241)"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    yaxis: {
      tickAmount: 5,
      labels: {
        formatter: (labelValue: number) =>
          (Math.round(labelValue * 100) / 100).toString().replace(".", ","),
      },
    },
    xaxis: {
      labels: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
      axisTicks: {
        show: false,
      },
    },
    fill: {
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.8,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
        /* eslint-disable indent */
        return `
          <div class="flex column tooltip px-2 font-semibold text-indigo-600">
            <div class="mr-1">
              <span>
                ${(
                  Math.round(
                    Number(series[seriesIndex][dataPointIndex]) * 100
                  ) / 100
                )
                  .toString()
                  .replace(".", ",")}
              </span>
            </div>

            <div>
              <span>
                ${new Date(w.globals.seriesX[seriesIndex][dataPointIndex])
                  .toLocaleDateString("pt-BR", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })
                  .replace(".", "")}
              </span>
            </div>
          </div>
        `;
      },
    },
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="bg-white w-full h-full max-w-[660px] max-h-[700px] p-6 rounded-md md:shadow-xl border border-indigo-200">
        <h1 className="text-indigo-500 text-2xl font-bold">
          Conversor de moedas
        </h1>

        <div className="flex md:flex-row flex-col items-center w-full pt-8 pb-14">
          <div className="w-full">
            <CurrencyInput
              value={amount}
              onChange={setAmount}
              selectValue={fromCurrency}
              onSelectChange={setFromCurrency}
            />
          </div>

          <div className="m-4">
            <FaExchangeAlt
              size="20px"
              className="cursor-pointer transition-colors text-indigo-500 hover:text-indigo-400"
              onClick={handleInverse}
            />
          </div>

          <div className="w-full">
            <CurrencyInput
              value={exchangeAmount}
              selectValue={toCurrency}
              onSelectChange={setToCurrency}
              isReadonly
            />
          </div>
        </div>

        <div>
          <h2 className="text-indigo-600 text-lg">
            Cotação nos últimos 30 dias
          </h2>
          <ReactApexChart
            options={chartOptions}
            series={series}
            type="area"
            width="100%"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
