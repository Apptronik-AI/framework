import fetch from "node-fetch"
import { type Config, mergeConfig } from "../config"
import type { ApiResponse, MarketData, TrendData } from "../types"
import { handleApiResponse } from "../utils/api"
import type { ApptronikAI } from "./ai"

export class MarketAnalysis {
  private config: Config
  private ai: ApptronikAI

  constructor(config: Config, ai: ApptronikAI) {
    this.config = mergeConfig(config)
    this.ai = ai
  }

  async getMarketData(): Promise<ApiResponse<MarketData>> {
    const url = `${this.config.baseUrl}/v1/market/data`
    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(),
    })

    return handleApiResponse<MarketData>(response)
  }

  async getTrends(): Promise<ApiResponse<TrendData[]>> {
    const url = `${this.config.baseUrl}/v1/market/trends`
    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(),
    })

    return handleApiResponse<TrendData[]>(response)
  }

  async getAssetDetails(assetId: string): Promise<ApiResponse<any>> {
    const url = `${this.config.baseUrl}/v1/market/assets/${assetId}`
    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(),
    })

    return handleApiResponse<any>(response)
  }

  async getHistoricalData(assetId: string, timeframe: string): Promise<ApiResponse<any>> {
    const url = `${this.config.baseUrl}/v1/market/history/${assetId}?timeframe=${timeframe}`
    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(),
    })

    return handleApiResponse<any>(response)
  }

  async analyzePortfolioRisk(portfolioId: string): Promise<ApiResponse<any>> {
    const url = `${this.config.baseUrl}/v1/analysis/risk/${portfolioId}`
    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(),
    })

    return handleApiResponse<any>(response)
  }

  async getCorrelationMatrix(assetIds: string[]): Promise<ApiResponse<any>> {
    const url = `${this.config.baseUrl}/v1/analysis/correlation`
    const response = await fetch(url, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ assetIds }),
    })

    return handleApiResponse<any>(response)
  }

  private getHeaders() {
    return {
      "Content-Type": "application/json",
      "X-API-Key": this.config.apiKey,
      "X-API-Secret": this.config.apiSecret,
    }
  }
}
