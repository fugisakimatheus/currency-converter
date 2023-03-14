import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Convert } from "easy-currencies";
import { format, sub } from "date-fns";
import {
  ExchangeHistory,
  getExchangeHistory,
} from "../services/exchange-history";

const CURRENCIES = [
  "USD",
  "AED",
  "ALL",
  "AMD",
  "ANG",
  "AOA",
  "ARS",
  "AUD",
  "AWG",
  "AZN",
  "BAM",
  "BBD",
  "BDT",
  "BGN",
  "BHD",
  "BIF",
  "BMD",
  "BND",
  "BOB",
  "BRL",
  "BSD",
  "BTN",
  "BWP",
  "BYN",
  "BZD",
  "CAD",
  "CDF",
  "CHF",
  "CLP",
  "CNY",
  "COP",
  "CRC",
  "CUP",
  "CVE",
  "CZK",
  "DJF",
  "DKK",
  "DOP",
  "DZD",
  "EGP",
  "ERN",
  "ETB",
  "EUR",
  "FJD",
  "FKP",
  "FOK",
  "GBP",
  "GEL",
  "GGP",
  "GHS",
  "GIP",
  "GMD",
  "GNF",
  "GTQ",
  "GYD",
  "HKD",
  "HNL",
  "HRK",
  "HTG",
  "HUF",
  "IDR",
  "ILS",
  "IMP",
  "INR",
  "IQD",
  "IRR",
  "ISK",
  "JEP",
  "JMD",
  "JOD",
  "JPY",
  "KES",
  "KGS",
  "KHR",
  "KID",
  "KMF",
  "KRW",
  "KWD",
  "KYD",
  "KZT",
  "LAK",
  "LBP",
  "LKR",
  "LRD",
  "LSL",
  "LYD",
  "MAD",
  "MDL",
  "MGA",
  "MKD",
  "MMK",
  "MNT",
  "MOP",
  "MRU",
  "MUR",
  "MVR",
  "MWK",
  "MXN",
  "MYR",
  "MZN",
  "NAD",
  "NGN",
  "NIO",
  "NOK",
  "NPR",
  "NZD",
  "OMR",
  "PAB",
  "PEN",
  "PGK",
  "PHP",
  "PKR",
  "PLN",
  "PYG",
  "QAR",
  "RON",
  "RSD",
  "RUB",
  "RWF",
  "SAR",
  "SBD",
  "SCR",
  "SDG",
  "SEK",
  "SGD",
  "SHP",
  "SLE",
  "SLL",
  "SOS",
  "SRD",
  "SSP",
  "STN",
  "SYP",
  "SZL",
  "THB",
  "TJS",
  "TMT",
  "TND",
  "TOP",
  "TRY",
  "TTD",
  "TVD",
  "TWD",
  "TZS",
  "UAH",
  "UGX",
  "UYU",
  "UZS",
  "VES",
  "VND",
  "VUV",
  "WST",
  "XAF",
  "XCD",
  "XDR",
  "XOF",
  "XPF",
  "YER",
  "ZAR",
  "ZMW",
  "ZWL",
] as const;

export type Currency = typeof CURRENCIES[number];

export type GraphicData = {
  date: string;
  value: number;
};

export interface CurrencyContextProps {
  fromCurrency: Currency;
  setFromCurrency: (currency: Currency) => void;
  toCurrency: Currency;
  setToCurrency: (currency: Currency) => void;
  amount: number;
  setAmount: (amount: number) => void;
  exchangeAmount: number;
  handleInverse: () => Promise<void>;
  allowedCurrencies: typeof CURRENCIES;
  graphicData: GraphicData[];
  isLoadingGraph: boolean;
}

const currencyContext = createContext<CurrencyContextProps>(
  {} as CurrencyContextProps
);

export const CurrencyProvider = (props: { children: React.ReactNode }) => {
  const [fromCurrency, setFromCurrency] = useState<Currency>("USD");
  const [toCurrency, setToCurrency] = useState<Currency>("BRL");
  const [amount, setAmount] = useState<number>(0);
  const [exchangeAmount, setExchangeAmount] = useState<number>(0);
  const [isLoadingGraph, setIsLoadingGraph] = useState<boolean>(false);
  const [graphicData, setGraphicData] = useState<GraphicData[]>([]);

  const last30Days = {
    from: format(sub(new Date(), { days: 30 }), "yyyy-MM-dd"),
    to: format(new Date(), "yyyy-MM-dd"),
  };

  const handleConvert = (rate: number) => {
    const converted = rate * amount;
    const rounded = Math.round(converted * 100) / 100;
    setExchangeAmount(rounded);
  };

  const handleInverse = async () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    await handleFetchHistorical();
    if (amount === 0) return;
    await handleFetchCurrencies();
  };

  const handleFetchCurrencies = useCallback(async () => {
    const convert = await Convert().from(fromCurrency).fetch();
    const rate = convert.rates[toCurrency];
    handleConvert(rate);
  }, [fromCurrency, toCurrency, amount]);

  const handleFetchHistorical = useCallback(async () => {
    const historical = JSON.parse(
      localStorage.getItem("historical") ?? "{}"
    ) as ExchangeHistory;

    const lastHistory = new Date(historical.end_date).getTime();
    const today = new Date(last30Days.to).getTime();

    if (
      historical.base === fromCurrency &&
      historical.end_date &&
      lastHistory <= today
    ) {
      setGraphicData(
        Object.keys(historical.rates).map((date) => ({
          date,
          value: historical.rates[date][toCurrency],
        }))
      );
      return;
    }

    try {
      setIsLoadingGraph(true);

      const response = await getExchangeHistory(
        fromCurrency,
        toCurrency,
        last30Days.from,
        last30Days.to
      );

      localStorage.setItem("historical", JSON.stringify(response));
      setGraphicData(
        Object.keys(response.rates).map((date) => ({
          date,
          value: response.rates[date][toCurrency],
        }))
      );
    } finally {
      setIsLoadingGraph(false);
    }
  }, [fromCurrency]);

  useEffect(() => {
    if (amount === 0) {
      setExchangeAmount(0);
      return;
    }
    handleFetchCurrencies();
  }, [amount]);

  useEffect(() => {
    handleFetchCurrencies();
    handleFetchHistorical();
  }, [fromCurrency, toCurrency]);

  return (
    <currencyContext.Provider
      value={{
        fromCurrency,
        setFromCurrency,
        toCurrency,
        setToCurrency,
        amount,
        setAmount,
        exchangeAmount,
        handleInverse,
        graphicData,
        isLoadingGraph,
        allowedCurrencies: CURRENCIES,
      }}
    >
      {props.children}
    </currencyContext.Provider>
  );
};

export const useCurrency = () => {
  return useContext(currencyContext);
};
