export * from "./core/portfolio"
export * from "./core/trading"
export * from "./core/analysis"
export * from "./core/ai"
export * from "./utils/market"
export * from "./utils/security"
export * from "./types"
export * from "./config"

import { ApptronikAI } from "./core/ai"
import { Portfolio } from "./core/portfolio"
import { TradingEngine } from "./core/trading"
import { MarketAnalysis } from "./core/analysis"
import type { Config } from "./config"

export const createApptronikAI = (config: Config) => {
  const ai = new ApptronikAI(config)
  const portfolio = new Portfolio(config)
  const trading = new TradingEngine(config, ai)
  const analysis = new MarketAnalysis(config, ai)

  return {
    ai,
    portfolio,
    trading,
    analysis,
    config,
  }
}

export default createApptronikAI
