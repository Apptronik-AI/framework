import fetch from "node-fetch"
import { type Config, mergeConfig } from "../config"
import type { ApiResponse, Portfolio as PortfolioType, PortfolioAsset } from "../types"
import { handleApiResponse } from "../utils/api"

export class Portfolio {
  private config: Config

  constructor(config: Config) {
    this.config = mergeConfig(config)
  }

  async create(name: string): Promise<ApiResponse<PortfolioType>> {
    const url = `${this.config.baseUrl}/v1/portfolios`
    const response = await fetch(url, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ name }),
    })

    return handleApiResponse<PortfolioType>(response)
  }

  async get(portfolioId: string): Promise<ApiResponse<PortfolioType>> {
    const url = `${this.config.baseUrl}/v1/portfolios/${portfolioId}`
    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(),
    })

    return handleApiResponse<PortfolioType>(response)
  }

  async list(): Promise<ApiResponse<PortfolioType[]>> {
    const url = `${this.config.baseUrl}/v1/portfolios`
    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(),
    })

    return handleApiResponse<PortfolioType[]>(response)
  }

  async update(portfolioId: string, data: Partial<PortfolioType>): Promise<ApiResponse<PortfolioType>> {
    const url = `${this.config.baseUrl}/v1/portfolios/${portfolioId}`
    const response = await fetch(url, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    })

    return handleApiResponse<PortfolioType>(response)
  }

  async delete(portfolioId: string): Promise<ApiResponse<void>> {
    const url = `${this.config.baseUrl}/v1/portfolios/${portfolioId}`
    const response = await fetch(url, {
      method: "DELETE",
      headers: this.getHeaders(),
    })

    return handleApiResponse<void>(response)
  }

  async addAsset(portfolioId: string, assetId: string, quantity: number): Promise<ApiResponse<PortfolioAsset>> {
    const url = `${this.config.baseUrl}/v1/portfolios/${portfolioId}/assets`
    const response = await fetch(url, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ assetId, quantity }),
    })

    return handleApiResponse<PortfolioAsset>(response)
  }

  async removeAsset(portfolioId: string, assetId: string): Promise<ApiResponse<void>> {
    const url = `${this.config.baseUrl}/v1/portfolios/${portfolioId}/assets/${assetId}`
    const response = await fetch(url, {
      method: "DELETE",
      headers: this.getHeaders(),
    })

    return handleApiResponse<void>(response)
  }

  async getPerformance(portfolioId: string, timeframe: string): Promise<ApiResponse<any>> {
    const url = `${this.config.baseUrl}/v1/portfolios/${portfolioId}/performance?timeframe=${timeframe}`
    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(),
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
