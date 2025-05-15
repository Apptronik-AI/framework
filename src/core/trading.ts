import fetch from "node-fetch"
import { type Config, mergeConfig } from "../config"
import type { ApiResponse, Trade, TradeType } from "../types"
import { handleApiResponse } from "../utils/api"
import type { ApptronikAI } from "./ai"

export class TradingEngine {
  private config: Config
  private ai: ApptronikAI

  constructor(config: Config, ai: ApptronikAI) {
    this.config = mergeConfig(config)
    this.ai = ai
  }

  async executeTrade(
    portfolioId: string,
    assetId: string,
    type: TradeType,
    quantity: number,
  ): Promise<ApiResponse<Trade>> {
    if (!this.config.tradingEnabled) {
      return {
        success: false,
        error: {
          code: "TRADING_DISABLED",
          message: "Trading is disabled in the configuration",
        },
      }
    }

    const url = `${this.config.baseUrl}/v1/trades`
    const response = await fetch(url, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({
        portfolioId,
        assetId,
        type,
        quantity,
      }),
    })

    return handleApiResponse<Trade>(response)
  }

  async getTrade(tradeId: string): Promise<ApiResponse<Trade>> {
    const url = `${this.config.baseUrl}/v1/trades/${tradeId}`
    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(),
    })

    return handleApiResponse<Trade>(response)
  }

  async listTrades(portfolioId: string): Promise<ApiResponse<Trade[]>> {
    const url = `${this.config.baseUrl}/v1/trades?portfolioId=${portfolioId}`
    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(),
    })

    return handleApiResponse<Trade[]>(response)
  }

  async cancelTrade(tradeId: string): Promise<ApiResponse<Trade>> {
    const url = `${this.config.baseUrl}/v1/trades/${tradeId}/cancel`
    const response = await fetch(url, {
      method: "POST",
      headers: this.getHeaders(),
    })

    return handleApiResponse<Trade>(response)
  }

  async executeRecommendedTrades(portfolioId: string): Promise<ApiResponse<Trade[]>> {
    if (!this.config.tradingEnabled) {
      return {
        success: false,
        error: {
          code: "TRADING_DISABLED",
          message: "Trading is disabled in the configuration",
        },
      }
    }

    const recommendationsResponse = await this.ai.getRecommendations(portfolioId)
    if (!recommendationsResponse.success || !recommendationsResponse.data) {
      return {
        success: false,
        error: recommendationsResponse.error || {
          code: "RECOMMENDATIONS_FAILED",
          message: "Failed to get AI recommendations",
        },
      }
    }

    const url = `${this.config.baseUrl}/v1/trades/auto`
    const response = await fetch(url, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({
        portfolioId,
        recommendations: recommendationsResponse.data,
      }),
    })

    return handleApiResponse<Trade[]>(response)
  }

  private getHeaders() {
    return {
      "Content-Type": "application/json",
      "X-API-Key": this.config.apiKey,
      "X-API-Secret": this.config.apiSecret,
    }
  }
}
