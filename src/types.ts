export interface Asset {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
  marketCap: number
  volume24h: number
}

export interface Portfolio {
  id: string
  name: string
  assets: PortfolioAsset[]
  totalValue: number
  performance: PerformanceMetrics
  createdAt: string
  updatedAt: string
}

export interface PortfolioAsset {
  asset: Asset
  quantity: number
  value: number
  allocation: number
  costBasis: number
  profit: number
  profitPercentage: number
}

export interface PerformanceMetrics {
  daily: number
  weekly: number
  monthly: number
  yearly: number
  allTime: number
  volatility: number
  sharpeRatio: number
}

export interface Trade {
  id: string
  portfolioId: string
  assetId: string
  type: TradeType
  quantity: number
  price: number
  total: number
  fee: number
  timestamp: string
  status: TradeStatus
}

export enum TradeType {
  BUY = "buy",
  SELL = "sell",
}

export enum TradeStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELED = "canceled",
}

export interface MarketData {
  assets: Asset[]
  trends: TrendData[]
  timestamp: string
}

export interface TrendData {
  trend: string
  assets: string[]
  confidence: number
  timeframe: string
}

export interface AIRecommendation {
  action: RecommendedAction
  assets: RecommendedAsset[]
  reasoning: string
  confidence: number
  timestamp: string
}

export interface RecommendedAsset {
  assetId: string
  action: "buy" | "sell" | "hold"
  targetAllocation: number
  confidence: number
}

export enum RecommendedAction {
  REBALANCE = "rebalance",
  BUY = "buy",
  SELL = "sell",
  HOLD = "hold",
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
}

export interface ApiError {
  code: string
  message: string
  details?: any
}
