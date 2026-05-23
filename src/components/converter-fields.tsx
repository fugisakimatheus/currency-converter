import { FaExchangeAlt } from "react-icons/fa";
import type { Currency } from "../contexts/currency";
import type { SupportedCurrency } from "../services/exchange-rates";
import { CurrencyInput } from "./input";

type ConverterFieldsProps = {
  amount: number;
  exchangeAmount: number;
  fromCurrency: Currency;
  toCurrency: Currency;
  allowedCurrencies: readonly SupportedCurrency[];
  onAmountChange: (amount: number) => void;
  onFromCurrencyChange: (currency: Currency) => void;
  onToCurrencyChange: (currency: Currency) => void;
  onInverse: () => void;
};

export function ConverterFields({
  amount,
  exchangeAmount,
  fromCurrency,
  toCurrency,
  allowedCurrencies,
  onAmountChange,
  onFromCurrencyChange,
  onToCurrencyChange,
  onInverse,
}: ConverterFieldsProps) {
  return (
    <div className="converter-fields relative mt-8">
      <CurrencyInput
        label="De"
        value={amount}
        onChange={onAmountChange}
        selectValue={fromCurrency}
        onSelectChange={onFromCurrencyChange}
        currencies={allowedCurrencies}
      />

      <button
        type="button"
        onClick={onInverse}
        className="glass-button converter-swap flex h-11 w-11 items-center justify-center justify-self-center rounded-full text-indigo-500 transition-transform hover:scale-105 active:scale-95 dark:text-indigo-300"
        aria-label="Inverter moedas"
        title="Inverter moedas"
      >
        <FaExchangeAlt size={18} />
      </button>

      <CurrencyInput
        label="Para"
        value={exchangeAmount}
        selectValue={toCurrency}
        onSelectChange={onToCurrencyChange}
        currencies={allowedCurrencies}
        isReadonly
      />
    </div>
  );
}
