export function roundRate(value: number): number {
  return Math.round(value * 100) / 100;
}

export function formatRateDisplay(value: number): string {
  return roundRate(value).toString().replace(".", ",");
}
