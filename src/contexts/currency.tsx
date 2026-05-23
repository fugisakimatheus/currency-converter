import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useCurrencyPair } from "../hooks/use-currency-pair";
import { roundRate } from "../lib/format";
import {
  GraphicPoint,
  SUPPORTED_CURRENCIES,
  SupportedCurrency,
} from "../services/exchange-rates";

export type Currency = SupportedCurrency;

export type GraphicData = GraphicPoint;

export interface CurrencyContextProps {
  fromCurrency: Currency;
  setFromCurrency: (currency: Currency) => void;
  toCurrency: Currency;
  setToCurrency: (currency: Currency) => void;
  amount: number;
  setAmount: (amount: number) => void;
  exchangeAmount: number;
  handleInverse: () => void;
  allowedCurrencies: typeof SUPPORTED_CURRENCIES;
  graphicData: GraphicData[];
  isLoadingGraph: boolean;
  graphError: string | null;
}

const currencyContext = createContext<CurrencyContextProps | null>(null);

export const CurrencyProvider = (props: { children: React.ReactNode }) => {
  const [fromCurrency, setFromCurrency] = useState<Currency>("USD");
  const [toCurrency, setToCurrency] = useState<Currency>("BRL");
  const [amount, setAmount] = useState<number>(1);
  const [exchangeAmount, setExchangeAmount] = useState<number>(0);

  const { graphicData, rate, isLoadingGraph, graphError } = useCurrencyPair(
    fromCurrency,
    toCurrency
  );

  useEffect(() => {
    if (!Number.isFinite(rate) || !Number.isFinite(amount) || amount <= 0) {
      setExchangeAmount(0);
      return;
    }
    setExchangeAmount(roundRate(rate * amount));
  }, [amount, rate]);

  const handleInverse = useCallback(() => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
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
        graphError,
        allowedCurrencies: SUPPORTED_CURRENCIES,
      }}
    >
      {props.children}
    </currencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(currencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
};
