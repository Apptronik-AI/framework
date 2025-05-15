export interface Config {
  apiKey: string
  apiSecret: string
  baseUrl?: string
  timeout?: number
  riskLevel?: RiskLevel
  tradingEnabled?: boolean
  maxAssets?: number
  rebalanceInterval?: number
  aiModelVersion?: string
}

export enum RiskLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export const DEFAULT_CONFIG: Partial<Config> = {
  baseUrl: "https://api.apptronik-ai.com",
  timeout: 30000,
  riskLevel: RiskLevel.MEDIUM,
  tradingEnabled: false,
  maxAssets: 10,
  rebalanceInterval: 86400000, // 24 hours
  aiModelVersion: "v1",
}

export const mergeConfig = (userConfig: Config): Config => {
  return {
    ...DEFAULT_CONFIG,
    ...userConfig,
  } as Config
}
