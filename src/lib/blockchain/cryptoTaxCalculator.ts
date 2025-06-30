
interface CryptoTransaction {
  id: string;
  type: 'buy' | 'sell' | 'trade' | 'transfer' | 'mining' | 'staking' | 'defi';
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  fiatValue: string;
  timestamp: number;
  chainId: number;
  txHash: string;
  gasFee: string;
}

export interface TaxEvent {
  id: string;
  transactionId: string;
  eventType: 'capital_gains' | 'income' | 'mining_income' | 'staking_reward' | 'defi_yield';
  amount: string;
  costBasis: string;
  gainLoss: string;
  holdingPeriod: number; // days
  taxRate: number;
  taxOwed: string;
  jurisdiction: string;
}

export interface TaxOptimizationSuggestion {
  type: 'tax_loss_harvesting' | 'holding_period' | 'jurisdiction_optimization' | 'timing_optimization';
  description: string;
  potentialSavings: string;
  implementationSteps: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export class CryptoTaxCalculator {
  private transactions: CryptoTransaction[] = [];
  private taxEvents: TaxEvent[] = [];

  async importTransactions(walletAddress: string, chainIds: number[]): Promise<CryptoTransaction[]> {
    // Mock implementation - would integrate with blockchain explorers
    console.log(`Importing transactions for wallet ${walletAddress} on chains:`, chainIds);
    
    const mockTransactions: CryptoTransaction[] = [
      {
        id: 'tx1',
        type: 'buy',
        fromToken: 'USD',
        toToken: 'ETH',
        fromAmount: '5000',
        toAmount: '2.5',
        fiatValue: '5000',
        timestamp: Date.now() - 90 * 24 * 60 * 60 * 1000, // 90 days ago
        chainId: 1,
        txHash: '0x123...',
        gasFee: '0.01'
      },
      {
        id: 'tx2',
        type: 'sell',
        fromToken: 'ETH',
        toToken: 'USD',
        fromAmount: '1.0',
        toAmount: '2200',
        fiatValue: '2200',
        timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
        chainId: 1,
        txHash: '0x456...',
        gasFee: '0.008'
      }
    ];

    this.transactions = mockTransactions;
    return mockTransactions;
  }

  async calculateTaxEvents(
    transactions: CryptoTransaction[],
    jurisdiction: string,
    taxYear: number
  ): Promise<TaxEvent[]> {
    const events: TaxEvent[] = [];

    for (const tx of transactions) {
      if (tx.type === 'sell' || tx.type === 'trade') {
        const costBasis = await this.getCostBasis(tx.fromToken, tx.fromAmount, tx.timestamp);
        const gainLoss = parseFloat(tx.fiatValue) - parseFloat(costBasis);
        const holdingPeriod = this.calculateHoldingPeriod(tx.fromToken, tx.timestamp);
        const taxRate = this.getTaxRate(jurisdiction, gainLoss > 0 ? 'capital_gains' : 'capital_loss', holdingPeriod);

        events.push({
          id: `event_${tx.id}`,
          transactionId: tx.id,
          eventType: 'capital_gains',
          amount: tx.fiatValue,
          costBasis,
          gainLoss: gainLoss.toString(),
          holdingPeriod,
          taxRate,
          taxOwed: (Math.max(0, gainLoss) * taxRate).toString(),
          jurisdiction
        });
      }
    }

    this.taxEvents = events;
    return events;
  }

  async generateTaxOptimizations(
    transactions: CryptoTransaction[],
    jurisdiction: string
  ): Promise<TaxOptimizationSuggestion[]> {
    const suggestions: TaxOptimizationSuggestion[] = [];

    // Tax loss harvesting opportunities
    const unrealizedLosses = await this.findUnrealizedLosses(transactions);
    if (unrealizedLosses.length > 0) {
      suggestions.push({
        type: 'tax_loss_harvesting',
        description: `Realize ${unrealizedLosses.length} positions with unrealized losses to offset gains`,
        potentialSavings: this.calculateTaxLossHarvestingSavings(unrealizedLosses),
        implementationSteps: [
          'Review positions with unrealized losses',
          'Sell losing positions before year-end',
          'Reinvest in similar but not identical assets to avoid wash sale rules'
        ],
        riskLevel: 'low'
      });
    }

    // Holding period optimization
    const shortTermHoldings = transactions.filter(tx => 
      this.calculateHoldingPeriod(tx.fromToken, tx.timestamp) < 365
    );
    
    if (shortTermHoldings.length > 0) {
      suggestions.push({
        type: 'holding_period',
        description: 'Defer sales to qualify for long-term capital gains rates',
        potentialSavings: '15-20% tax rate reduction',
        implementationSteps: [
          'Identify positions approaching long-term status',
          'Defer sales by a few days/weeks to qualify for lower rates',
          'Plan sales calendar for optimal tax treatment'
        ],
        riskLevel: 'medium'
      });
    }

    return suggestions;
  }

  async generateTaxReport(taxYear: number, jurisdiction: string): Promise<any> {
    const report = {
      taxYear,
      jurisdiction,
      summary: {
        totalGains: this.taxEvents.reduce((sum, event) => 
          sum + Math.max(0, parseFloat(event.gainLoss)), 0),
        totalLosses: this.taxEvents.reduce((sum, event) => 
          sum + Math.min(0, parseFloat(event.gainLoss)), 0),
        totalTaxOwed: this.taxEvents.reduce((sum, event) => 
          sum + parseFloat(event.taxOwed), 0),
        totalTransactions: this.transactions.length
      },
      events: this.taxEvents,
      optimizations: await this.generateTaxOptimizations(this.transactions, jurisdiction)
    };

    return report;
  }

  private async getCostBasis(token: string, amount: string, saleTimestamp: number): Promise<string> {
    // FIFO method for cost basis calculation
    // Mock implementation
    return (parseFloat(amount) * 2000).toString(); // Assume $2000 per token
  }

  private calculateHoldingPeriod(token: string, saleTimestamp: number): number {
    // Mock calculation - would track actual purchase dates
    return Math.floor((Date.now() - saleTimestamp) / (24 * 60 * 60 * 1000));
  }

  private getTaxRate(jurisdiction: string, type: string, holdingPeriod: number): number {
    const rates: { [key: string]: { [key: string]: number } } = {
      'US': {
        'capital_gains_short': 0.37, // Short-term (ordinary income)
        'capital_gains_long': 0.20,  // Long-term
        'mining_income': 0.37,
        'staking_reward': 0.37
      },
      'UK': {
        'capital_gains_short': 0.20,
        'capital_gains_long': 0.20,
        'mining_income': 0.45,
        'staking_reward': 0.45
      }
    };

    const jurisdictionRates = rates[jurisdiction] || rates['US'];
    
    if (type === 'capital_gains') {
      return holdingPeriod >= 365 ? 
        jurisdictionRates['capital_gains_long'] : 
        jurisdictionRates['capital_gains_short'];
    }

    return jurisdictionRates[type] || 0.25;
  }

  private async findUnrealizedLosses(transactions: CryptoTransaction[]): Promise<any[]> {
    // Mock implementation
    return [
      { token: 'AVAX', amount: '100', unrealizedLoss: '-500' },
      { token: 'MATIC', amount: '1000', unrealizedLoss: '-200' }
    ];
  }

  private calculateTaxLossHarvestingSavings(losses: any[]): string {
    const totalLoss = losses.reduce((sum, loss) => sum + Math.abs(parseFloat(loss.unrealizedLoss)), 0);
    return (totalLoss * 0.25).toString(); // Assume 25% tax rate
  }
}
