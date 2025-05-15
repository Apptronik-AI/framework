import createApptronikAI from "../index"

async function basicUsageExample() {
  // Initialize the framework with your API credentials
  const apptronik = createApptronikAI({
    apiKey: "YOUR_API_KEY",
    apiSecret: "YOUR_API_SECRET",
  })

  try {
    // Create a new portfolio
    const portfolioResponse = await apptronik.portfolio.create("My First Portfolio")

    if (!portfolioResponse.success || !portfolioResponse.data) {
      console.error("Failed to create portfolio:", portfolioResponse.error)
      return
    }

    const portfolioId = portfolioResponse.data.id
    console.log(`Portfolio created with ID: ${portfolioId}`)

    // Add some assets to the portfolio
    await apptronik.portfolio.addAsset(portfolioId, "BTC", 0.1)
    await apptronik.portfolio.addAsset(portfolioId, "ETH", 1.5)

    // Get the updated portfolio
    const updatedPortfolioResponse = await apptronik.portfolio.get(portfolioId)

    if (updatedPortfolioResponse.success && updatedPortfolioResponse.data) {
      console.log("Portfolio value:", updatedPortfolioResponse.data.totalValue)
      console.log("Assets:")
      updatedPortfolioResponse.data.assets.forEach((asset) => {
        console.log(`- ${asset.asset.symbol}: ${asset.quantity} (${asset.value} USD)`)
      })
    }

    // Get AI recommendations
    const recommendationsResponse = await apptronik.ai.getRecommendations(portfolioId)

    if (recommendationsResponse.success && recommendationsResponse.data) {
      console.log("AI Recommendations:")
      console.log(`- Action: ${recommendationsResponse.data.action}`)
      console.log(`- Reasoning: ${recommendationsResponse.data.reasoning}`)
      console.log("- Recommended assets:")

      recommendationsResponse.data.assets.forEach((asset) => {
        console.log(`  - ${asset.assetId}: ${asset.action} (${asset.targetAllocation}%)`)
      })
    }

    // Get market analysis
    const marketResponse = await apptronik.analysis.getMarketData()

    if (marketResponse.success && marketResponse.data) {
      console.log("Top 5 assets by market cap:")
      marketResponse.data.assets.slice(0, 5).forEach((asset) => {
        console.log(`- ${asset.symbol} (${asset.name}): $${asset.price} (${asset.change24h}%)`)
      })
    }
  } catch (error) {
    console.error("An error occurred:", error)
  }
}

// Run the example
basicUsageExample().catch(console.error)
