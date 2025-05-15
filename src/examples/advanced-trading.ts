import createApptronikAI from "../index"
import { TradeType } from "../types"

async function advancedTradingExample() {
  // Initialize with trading enabled
  const apptronik = createApptronikAI({
    apiKey: "YOUR_API_KEY",
    apiSecret: "YOUR_API_SECRET",
    tradingEnabled: true,
    riskLevel: "medium",
  })

  try {
    // Get existing portfolios
    const portfoliosResponse = await apptronik.portfolio.list()

    let portfolioId

    if (!portfoliosResponse.success || !portfoliosResponse.data || portfoliosResponse.data.length === 0) {
      console.log("No portfolios found. Creating a new one...")

      const newPortfolioResponse = await apptronik.portfolio.create("Trading Portfolio")
      if (!newPortfolioResponse.success || !newPortfolioResponse.data) {
        console.error("Failed to create portfolio:", newPortfolioResponse.error)
        return
      }

      portfolioId = newPortfolioResponse.data.id
    } else {
      portfolioId = portfoliosResponse.data[0].id
    }

    console.log(`Using portfolio with ID: ${portfolioId}`)

    // Execute a manual trade
    const tradeResponse = await apptronik.trading.executeTrade(portfolioId, "BTC", TradeType.BUY, 0.05)

    if (tradeResponse.success && tradeResponse.data) {
      console.log("Trade executed:")
      console.log(`- ID: ${tradeResponse.data.id}`)
      console.log(`- Type: ${tradeResponse.data.type}`)
      console.log(`- Asset: ${tradeResponse.data.assetId}`)
      console.log(`- Quantity: ${tradeResponse.data.quantity}`)
      console.log(`- Price: $${tradeResponse.data.price}`)
      console.log(`- Total: $${tradeResponse.data.total}`)
      console.log(`- Status: ${tradeResponse.data.status}`)
    } else {
      console.error("Failed to execute trade:", tradeResponse.error)
    }

    // Get AI recommendations
    const recommendationsResponse = await apptronik.ai.getRecommendations(portfolioId)

    if (recommendationsResponse.success && recommendationsResponse.data) {
      console.log("AI Recommendations:")
      console.log(`- Action: ${recommendationsResponse.data.action}`)
      console.log(`- Confidence: ${recommendationsResponse.data.confidence}`)

      // Execute AI-recommended trades
      console.log("Executing AI-recommended trades...")
      const autoTradesResponse = await apptronik.trading.executeRecommendedTrades(portfolioId)

      if (autoTradesResponse.success && autoTradesResponse.data) {
        console.log(`${autoTradesResponse.data.length} trades executed automatically`)

        autoTradesResponse.data.forEach((trade, index) => {
          console.log(`Trade ${index + 1}:`)
          console.log(`- Asset: ${trade.assetId}`)
          console.log(`- Type: ${trade.type}`)
          console.log(`- Quantity: ${trade.quantity}`)
          console.log(`- Price: $${trade.price}`)
        })
      } else {
        console.error("Failed to execute AI-recommended trades:", autoTradesResponse.error)
      }
    }

    // Get trade history
    const tradesResponse = await apptronik.trading.listTrades(portfolioId)

    if (tradesResponse.success && tradesResponse.data) {
      console.log(`Trade history (${tradesResponse.data.length} trades):`)

      tradesResponse.data.forEach((trade, index) => {
        console.log(`Trade ${index + 1}: ${trade.type} ${trade.quantity} ${trade.assetId} at $${trade.price}`)
      })
    }
  } catch (error) {
    console.error("An error occurred:", error)
  }
}

// Run the example
advancedTradingExample().catch(console.error)
