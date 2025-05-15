import fetch from "node-fetch"
import { type Config, mergeConfig } from "../config"
import type { AIRecommendation, ApiResponse, Asset, Portfolio } from "../types"
import { handleApiResponse } from "../utils/api"

export class ApptronikAI {
  private config: Config

  constructor(config: Config) {
    this.config = mergeConfig(config)
  }

  async analyzeMarket(): Promise<ApiResponse<Asset[]>> {
    const url = `${this.config.baseUrl}/v1/ai/market-analysis`
    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(),
    })

    return handleApiResponse<Asset[]>(response)
  }

  async getRecommendations(portfolioId: string): Promise<ApiResponse<AIRecommendation>> {
    const url = `${this.config.baseUrl}/v1/ai/recommendations/${portfolioId}`
    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(),
    })

    return handleApiResponse<AIRecommendation>(response)
  }

  async optimizePortfolio(portfolio: Portfolio): Promise<ApiResponse<Portfolio>> {
    const url = `${this.config.baseUrl}/v1/ai/optimize`
    const response = await fetch(url, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ portfolio }),
    })

    return handleApiResponse<Portfolio>(response)
  }

  async predictAssetPrice(assetId: string, timeframe: string): Promise<ApiResponse<any>> {
    const url = `${this.config.baseUrl}/v1/ai/predict/${assetId}`
    const response = await fetch(url, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ timeframe }),
    })

    return handleApiResponse<any>(response)
  }

  private getHeaders() {
    return {
      "Content-Type": "application/json",
      "X-API-Key": this.config.apiKey,
      "X-API-Secret": this.config.apiSecret,
      "X-AI-Model": this.config.aiModelVersion,
    }
  }
}
