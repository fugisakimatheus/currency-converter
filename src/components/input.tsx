import type { Currency } from "../contexts/currency";
import type { SupportedCurrency } from "../services/exchange-rates";

type CurrencyInputProps = {
  value: number;
  onChange?: (value: number) => void;
  selectValue: string;
  onSelectChange: (value: Currency) => void;
  currencies: readonly SupportedCurrency[];
  isReadonly?: boolean;
  label: string;
};

export const CurrencyInput = (props: CurrencyInputProps) => {
  const {
    value,
    onChange,
    selectValue,
    onSelectChange,
    currencies,
    isReadonly = false,
    label,
  } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;
    const parsed = Number(event.target.value);
    onChange(Number.isFinite(parsed) && parsed >= 0 ? parsed : 0);
  };

  const displayValue = value === 0 ? "" : value;

  return (
    <div className="flex min-w-0 w-full flex-col gap-2">
      <label className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </label>
      <div className="glass-input flex min-w-0 w-full items-center gap-2 rounded-xl px-3 py-2">
        <input
          type="number"
          min={0}
          step="any"
          inputMode="decimal"
          placeholder="0"
          value={displayValue}
          onChange={handleChange}
          className="min-w-0 flex-1 bg-transparent text-lg font-semibold text-slate-800 placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
          readOnly={isReadonly}
          aria-readonly={isReadonly}
        />
        <select
          className="glass-select w-[4.5rem] shrink-0 rounded-lg px-1.5 py-1 text-sm font-semibold text-indigo-600 dark:text-indigo-300"
          value={selectValue}
          onChange={(e) => onSelectChange(e.target.value as Currency)}
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
