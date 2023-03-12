import { Currency, useCurrency } from "../contexts/currency";

type CurrencyInputProps = {
  value: number;
  onChange?: (value: number) => void;
  selectValue: string;
  onSelectChange: (value: Currency) => void;
  isReadonly?: boolean;
};

export const CurrencyInput = (props: CurrencyInputProps) => {
  const {
    value,
    onChange,
    selectValue,
    onSelectChange,
    isReadonly = false,
  } = props;

  const { allowedCurrencies } = useCurrency();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(Number(event.target.value));
  };

  return (
    <div className="w-full transition-colors rounded-md flex row items-center bg-neutral-100 px-3 py-1 border border-transparent hover:border-indigo-400">
      <input
        type="number"
        value={value}
        onChange={handleChange}
        className="w-[70%]"
        readOnly={isReadonly}
      />
      <select
        className="w-[30%] scrollbar-thin scrollbar-track-neutral-200 scrollbar-thumb-neutral-300"
        value={selectValue}
        onChange={(e) => onSelectChange(e.target.value as Currency)}
      >
        {allowedCurrencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </div>
  );
};
