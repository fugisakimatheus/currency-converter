import { ConverterFields } from "./components/converter-fields";
import { ExchangeChart } from "./components/exchange-chart";
import { ThemeTransitionOverlay } from "./components/theme-transition-overlay";
import { ThemeToggle } from "./components/theme-toggle";
import { useCurrency } from "./contexts/currency";
import { useTheme } from "./contexts/theme";

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
    allowedCurrencies,
    graphicData,
    isLoadingGraph,
    graphError,
  } = useCurrency();

  const { theme, themeTransition } = useTheme();

  return (
    <div className="app-shell relative flex min-h-screen w-full items-center justify-center p-4 sm:p-8">
      <ThemeTransitionOverlay phase={themeTransition} />

      <div className="glass-panel relative w-full max-w-2xl overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl" />

        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-400">
              Câmbio em tempo real
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              Conversor de moedas
            </h1>
          </div>
          <div className="h-10 w-10 shrink-0">
            <ThemeToggle />
          </div>
        </header>

        <ConverterFields
          amount={amount}
          exchangeAmount={exchangeAmount}
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
          allowedCurrencies={allowedCurrencies}
          onAmountChange={setAmount}
          onFromCurrencyChange={setFromCurrency}
          onToCurrencyChange={setToCurrency}
          onInverse={handleInverse}
        />

        <section className="relative mt-10">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Cotação nos últimos 30 dias
          </h2>

          <ExchangeChart
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
            graphicData={graphicData}
            isLoading={isLoadingGraph}
            error={graphError}
            theme={theme}
          />
        </section>
      </div>
    </div>
  );
}

export default App;
