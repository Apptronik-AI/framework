import Decimal from "decimal.js"

export function calculatePortfolioValue(assets: Array<{ quantity: number; price: number }>): number {
  return assets.reduce((total, asset) => {
    return total + asset.quantity * asset.price
  }, 0)
}

export function calculateAllocation(assetValue: number, portfolioValue: number): number {
  if (portfolioValue === 0) return 0
  return (assetValue / portfolioValue) * 100
}

export function calculateProfit(currentValue: number, costBasis: number): number {
  return currentValue - costBasis
}

export function calculateProfitPercentage(currentValue: number, costBasis: number): number {
  if (costBasis === 0) return 0
  return ((currentValue - costBasis) / costBasis) * 100
}

export function calculateVolatility(prices: number[]): number {
  if (prices.length < 2) return 0

  const returns: number[] = []
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1])
  }

  const mean = returns.reduce((sum, value) => sum + value, 0) / returns.length
  const variance = returns.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / returns.length

  return Math.sqrt(variance)
}

export function calculateSharpeRatio(returns: number[], riskFreeRate = 0.02): number {
  if (returns.length === 0) return 0

  const meanReturn = returns.reduce((sum, value) => sum + value, 0) / returns.length
  const excessReturns = returns.map((r) => r - riskFreeRate)
  const stdDev = calculateVolatility(returns)

  if (stdDev === 0) return 0
  return (meanReturn - riskFreeRate) / stdDev
}

export function formatCurrency(value: number, currency = "USD", locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value)
}

export function formatPercentage(value: number, locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100)
}

export function preciseCalculation(
  a: number,
  b: number,
  operation: "add" | "subtract" | "multiply" | "divide",
): number {
  const decA = new Decimal(a)
  const decB = new Decimal(b)

  switch (operation) {
    case "add":
      return decA.plus(decB).toNumber()
    case "subtract":
      return decA.minus(decB).toNumber()
    case "multiply":
      return decA.times(decB).toNumber()
    case "divide":
      if (decB.isZero()) throw new Error("Division by zero")
      return decA.dividedBy(decB).toNumber()
    default:
      throw new Error("Invalid operation")
  }
}
