import createApptronikAI from "../index"

async function portfolioAnalysisExample() {
  const apptronik = createApptronikAI({
    apiKey: "YOUR_API_KEY",
    apiSecret: "YOUR_API_SECRET",
  })

  try {
    // Get existing portfolios
    const portfoliosResponse = await apptronik.portfolio.list()

    if (!portfoliosResponse.success || !portfoliosResponse.data || portfoliosResponse.data.length === 0) {
      console.error("No portfolios found")
      return
    }

    const portfolioId = portfoliosResponse.data[0].id
    console.log(`Analyzing portfolio with ID: ${portfolioId}`)

    // Get portfolio details
    const portfolioResponse = await apptronik.portfolio.get(portfolioId)

    if (!portfolioResponse.success || !portfolioResponse.data) {
      console.error("Failed to get portfolio details:", portfolioResponse.error)
      return
    }

    const portfolio = portfolioResponse.data
    console.log(`Portfolio: ${portfolio.name}`)
    console.log(`Total value: $${portfolio.totalValue}`)
    console.log(`Performance:`)
    console.log(`- Daily: ${portfolio.performance.daily}%`)
    console.log(`- Weekly: ${portfolio.performance.weekly}%`)
    console.log(`- Monthly: ${portfolio.performance.monthly}%`)
    console.log(`- Yearly: ${portfolio.performance.yearly}%`)

    // Get detailed performance
    const performanceResponse = await apptronik.portfolio.getPerformance(portfolioId, "1m")

    if (performanceResponse.success && performanceResponse.data) {
      console.log("Monthly performance data available")
    }

    // Analyze portfolio risk
    const riskResponse = await apptronik.analysis.analyzePortfolioRisk(portfolioId)

    if (riskResponse.success && riskResponse.data) {
      console.log("Risk Analysis:")
      console.log(`- Volatility: ${riskResponse.data.volatility}`)
      console.log(`- Sharpe Ratio: ${riskResponse.data.sharpeRatio}`)
      console.log(`- Max Drawdown: ${riskResponse.data.maxDrawdown}%`)
      console.log(`- Risk Level: ${riskResponse.data.riskLevel}`)
    }

    // Get asset correlations
    const assetIds = portfolio.assets.map((asset) => asset.asset.id)
    const correlationResponse = await apptronik.analysis.getCorrelationMatrix(assetIds)

    if (correlationResponse.success && correlationResponse.data) {
      console.log("Asset Correlation Matrix available")
    }

    // Optimize portfolio
    const optimizationResponse = await apptronik.ai.optimizePortfolio(portfolio)

    if (optimizationResponse.success && optimizationResponse.data) {
      console.log("Portfolio Optimization Recommendations:")

      const optimizedPortfolio = optimizationResponse.data
      const currentAssets = new Map(portfolio.assets.map((asset) => [asset.asset.id, asset]))

      optimizedPortfolio.assets.forEach((asset) => {
        const currentAsset = currentAssets.get(asset.asset.id)

        if (currentAsset) {
          const allocationDiff = asset.allocation - currentAsset.allocation
          console.log(
            `- ${asset.asset.symbol}: ${currentAsset.allocation}% → ${asset.allocation}% (${allocationDiff > 0 ? "+" : ""}${allocationDiff.toFixed(2)}%)`,
          )
        } else {
          console.log(`- Add ${asset.asset.symbol}: ${asset.allocation}%`)
        }
      })

      console.log(`Expected improvement:`)
      console.log(`- Return: ${optimizationResponse.data.performance.yearly - portfolio.performance.yearly}%`)
      console.log(`- Risk: ${optimizationResponse.data.performance.volatility - portfolio.performance.volatility}`)
    }
  } catch (error) {
    console.error("An error occurred:", error)
  }
}

// Run the example
portfolioAnalysisExample().catch(console.error)
