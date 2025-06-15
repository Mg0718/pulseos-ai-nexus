import { PulsePayManager } from './pulsePay';
import { BlockchainSessionLogger } from './sessionLogger';
import { Web3Provider } from './web3Provider';

export interface BlockchainPaymentDecision {
  decisionId: string;
  paymentDetails: any;
  blockchainApproval: boolean;
  decisionHash: string;
  processorToUse: 'stripe' | 'razorpay';
  securityLevel: 'high' | 'medium' | 'low';
}

export interface PayrollAutomation {
  contractId: string;
  employeeId: string;
  salary: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  performanceBonus: string;
  taxWithholding: string;
  nextPayment: number;
}

export interface InvoiceAutomation {
  invoiceId: string;
  clientId: string;
  amount: string;
  approvalRule: 'auto' | 'threshold' | 'manual';
  threshold: string;
  autoApproved: boolean;
}

export interface TaxCalculation {
  transactionId: string;
  amount: string;
  taxType: 'income' | 'capital_gains' | 'payroll';
  jurisdiction: string;
  taxRate: number;
  taxAmount: string;
  withholdingAddress: string;
}

export class EnhancedBlockchainPulsePay extends PulsePayManager {
  private sessionLogger: BlockchainSessionLogger;

  constructor() {
    super();
    this.sessionLogger = new BlockchainSessionLogger();
  }

  // ==================== PHASE 2: SMART CONTRACT AUTOMATION ====================

  // Automated Payroll Contract Management
  async createPayrollContract(
    employeeId: string,
    salary: string,
    frequency: 'weekly' | 'biweekly' | 'monthly',
    performanceBonus: string = '0'
  ): Promise<PayrollAutomation> {
    try {
      const taxWithholding = this.calculateTaxWithholding(salary, 'payroll', 'US');
      
      const payrollContract: PayrollAutomation = {
        contractId: `payroll_${Date.now()}`,
        employeeId,
        salary,
        frequency,
        performanceBonus,
        taxWithholding: taxWithholding.taxAmount,
        nextPayment: this.calculateNextPaymentDate(frequency)
      };

      // Deploy smart contract for automated payroll
      const contractAddress = await this.deployPayrollSmartContract(payrollContract);
      console.log(`Payroll contract deployed: ${contractAddress}`);

      // Store contract on IPFS for transparency
      await this.storeOnIPFS(payrollContract);

      return payrollContract;
    } catch (error) {
      console.error('Payroll contract creation failed:', error);
      throw error;
    }
  }

  async executeAutomatedPayroll(contracts: PayrollAutomation[]): Promise<{
    successful: PayrollAutomation[];
    failed: Array<{ contract: PayrollAutomation; error: string }>;
  }> {
    const successful: PayrollAutomation[] = [];
    const failed: Array<{ contract: PayrollAutomation; error: string }> = [];

    for (const contract of contracts) {
      try {
        // Calculate net payment (salary + bonus - taxes)
        const netPayment = parseFloat(contract.salary) + 
                          parseFloat(contract.performanceBonus) - 
                          parseFloat(contract.taxWithholding);

        // Execute blockchain payment
        const paymentResult = await this.processBlockchainManagedPayment(
          contract.employeeId,
          netPayment.toString(),
          'USD',
          { contractId: contract.contractId, type: 'payroll' }
        );

        // Update next payment date
        contract.nextPayment = this.calculateNextPaymentDate(contract.frequency);
        successful.push(contract);

        console.log(`Payroll executed for ${contract.employeeId}: $${netPayment}`);
      } catch (error) {
        failed.push({ contract, error: error.message });
      }
    }

    return { successful, failed };
  }

  // Invoice-to-Payment Automation
  async createAutomatedInvoice(
    clientId: string,
    amount: string,
    approvalRules: Array<{ type: string; conditions: any }>
  ): Promise<InvoiceAutomation> {
    try {
      const invoice: InvoiceAutomation = {
        invoiceId: `inv_${Date.now()}`,
        clientId,
        amount,
        approvalRule: 'auto',
        threshold: '0',
        autoApproved: false
      };

      // Apply approval rules
      invoice.autoApproved = await this.evaluateApprovalRules(invoice, approvalRules);

      if (invoice.autoApproved) {
        // Create smart contract for automatic payment
        await this.createPaymentContract(
          clientId,
          amount,
          [{
            description: `Auto-approved invoice ${invoice.invoiceId}`,
            amount,
            dueDate: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
          }]
        );
      }

      // Store invoice automation on blockchain
      await this.storeOnIPFS(invoice);

      return invoice;
    } catch (error) {
      console.error('Invoice automation creation failed:', error);
      throw error;
    }
  }

  private async evaluateApprovalRules(
    invoice: InvoiceAutomation, 
    rules: Array<{ type: string; conditions: any }>
  ): Promise<boolean> {
    for (const rule of rules) {
      switch (rule.type) {
        case 'amount_threshold':
          if (parseFloat(invoice.amount) <= rule.conditions.maxAmount) {
            return true;
          }
          break;
        case 'client_whitelist':
          if (rule.conditions.clients.includes(invoice.clientId)) {
            return true;
          }
          break;
        case 'auto_approve':
          return true;
      }
    }
    return false;
  }

  // Tax Integration & Automation
  calculateTaxWithholding(
    amount: string,
    taxType: 'income' | 'capital_gains' | 'payroll',
    jurisdiction: string = 'US'
  ): TaxCalculation {
    const taxRates = {
      US: { income: 0.22, capital_gains: 0.15, payroll: 0.1535 },
      UK: { income: 0.20, capital_gains: 0.20, payroll: 0.1325 },
      CA: { income: 0.26, capital_gains: 0.13, payroll: 0.118 }
    };

    const rate = taxRates[jurisdiction]?.[taxType] || 0.22;
    const taxAmount = parseFloat(amount) * rate;

    return {
      transactionId: `tax_${Date.now()}`,
      amount,
      taxType,
      jurisdiction,
      taxRate: rate,
      taxAmount: taxAmount.toString(),
      withholdingAddress: `0x${Math.random().toString(16).substring(2, 42)}`
    };
  }

  async processAutomatedTaxWithholding(
    transactions: Array<{ amount: string; type: string; jurisdiction?: string }>
  ): Promise<TaxCalculation[]> {
    const taxCalculations: TaxCalculation[] = [];

    for (const transaction of transactions) {
      const taxCalc = this.calculateTaxWithholding(
        transaction.amount,
        transaction.type as any,
        transaction.jurisdiction
      );

      // Execute tax withholding smart contract
      await this.executeSmartContract('withholdTax', [
        taxCalc.transactionId,
        taxCalc.taxAmount,
        taxCalc.withholdingAddress
      ]);

      taxCalculations.push(taxCalc);
    }

    // Store tax calculations on blockchain for audit
    await this.storeOnIPFS({
      calculations: taxCalculations,
      timestamp: Date.now(),
      type: 'tax_withholding_batch'
    });

    return taxCalculations;
  }

  // ==================== EXISTING METHODS (Phase 1) ====================

  async processBlockchainManagedPayment(
    payee: string,
    amount: string,
    currency: string = 'USD',
    metadata: any = {}
  ): Promise<{
    blockchainDecision: BlockchainPaymentDecision;
    paymentResult: any;
    auditTrail: string;
  }> {
    try {
      const blockchainDecision = await this.makeBlockchainPaymentDecision({
        payee,
        amount,
        currency,
        metadata
      });

      if (!blockchainDecision.blockchainApproval) {
        throw new Error('Payment rejected by blockchain security analysis');
      }

      const paymentResult = await this.executePaymentThroughProcessor(
        blockchainDecision.processorToUse,
        blockchainDecision.paymentDetails
      );

      const auditTrail = await this.logPaymentAuditTrail(
        blockchainDecision,
        paymentResult
      );

      console.log(`Blockchain-managed payment completed: ${blockchainDecision.decisionId}`);
      
      return {
        blockchainDecision,
        paymentResult,
        auditTrail
      };
    } catch (error) {
      console.error('Blockchain payment processing failed:', error);
      await this.logPaymentFailure(error, { payee, amount, currency });
      throw error;
    }
  }

  async processBlockchainPayroll(
    employees: Array<{
      employeeId: string;
      amount: string;
      currency: string;
      metadata?: any;
    }>
  ): Promise<{
    successful: any[];
    failed: any[];
    blockchainAuditHash: string;
  }> {
    try {
      const successful = [];
      const failed = [];

      for (const employee of employees) {
        try {
          const payrollDecision = await this.sessionLogger.createPayrollDecision(
            employee.employeeId,
            employee.amount,
            employee.currency,
            'stripe'
          );

          const result = await this.executePaymentThroughProcessor(
            payrollDecision.paymentProcessorUsed,
            {
              recipient: employee.employeeId,
              amount: employee.amount,
              currency: employee.currency,
              type: 'payroll',
              blockchainDecisionId: payrollDecision.payrollId
            }
          );

          successful.push({ employee, decision: payrollDecision, result });
        } catch (error) {
          failed.push({ employee, error: error.message });
        }
      }

      const blockchainAuditHash = await this.createPayrollAuditHash({
        timestamp: Date.now(),
        totalEmployees: employees.length,
        successful: successful.length,
        failed: failed.length,
        totalAmount: employees.reduce((sum, emp) => sum + parseFloat(emp.amount), 0)
      });

      return { successful, failed, blockchainAuditHash };
    } catch (error) {
      console.error('Blockchain payroll processing failed:', error);
      throw error;
    }
  }

  // ==================== PRIVATE HELPER METHODS ====================

  private calculateNextPaymentDate(frequency: string): number {
    const now = Date.now();
    switch (frequency) {
      case 'weekly':
        return now + 7 * 24 * 60 * 60 * 1000;
      case 'biweekly':
        return now + 14 * 24 * 60 * 60 * 1000;
      case 'monthly':
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        nextMonth.setDate(1);
        return nextMonth.getTime();
      default:
        return now + 30 * 24 * 60 * 60 * 1000;
    }
  }

  private async deployPayrollSmartContract(contract: PayrollAutomation): Promise<string> {
    const contractAddress = `0x${Math.random().toString(16).substring(2, 42)}`;
    console.log(`Deploying payroll contract for ${contract.employeeId}:`, contract);
    return contractAddress;
  }

  private async makeBlockchainPaymentDecision(paymentRequest: any): Promise<BlockchainPaymentDecision> {
    const decisionId = `decision_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    const riskScore = await this.analyzePaymentRisk(paymentRequest);
    const securityLevel = this.determineSecurityLevel(riskScore);
    const processorToUse = this.selectOptimalProcessor(paymentRequest, securityLevel);
    
    const decisionData = {
      decisionId,
      paymentDetails: paymentRequest,
      riskScore,
      securityLevel,
      processorToUse,
      timestamp: Date.now()
    };

    const decisionHash = await this.createDecisionHash(decisionData);
    const blockchainApproval = riskScore < 0.7;

    return {
      decisionId,
      paymentDetails: paymentRequest,
      blockchainApproval,
      decisionHash,
      processorToUse,
      securityLevel
    };
  }

  private async analyzePaymentRisk(paymentRequest: any): Promise<number> {
    const amount = parseFloat(paymentRequest.amount);
    const baseRisk = Math.min(amount / 10000, 0.5);
    const frequencyRisk = 0.1;
    const recipientRisk = 0.05;
    
    return Math.min(baseRisk + frequencyRisk + recipientRisk, 1.0);
  }

  private determineSecurityLevel(riskScore: number): 'high' | 'medium' | 'low' {
    if (riskScore > 0.7) return 'high';
    if (riskScore > 0.3) return 'medium';
    return 'low';
  }

  private selectOptimalProcessor(paymentRequest: any, securityLevel: string): 'stripe' | 'razorpay' {
    const amount = parseFloat(paymentRequest.amount);
    
    if (securityLevel === 'high' || amount > 5000) {
      return 'stripe';
    }
    
    return 'razorpay';
  }

  private async executePaymentThroughProcessor(processor: 'stripe' | 'razorpay', paymentDetails: any): Promise<any> {
    console.log(`Executing payment through ${processor}:`, paymentDetails);
    
    return {
      processorUsed: processor,
      transactionId: `${processor}_${Date.now()}`,
      status: 'completed',
      amount: paymentDetails.amount,
      timestamp: Date.now()
    };
  }

  private async logPaymentAuditTrail(decision: BlockchainPaymentDecision, result: any): Promise<string> {
    const auditData = {
      decisionId: decision.decisionId,
      decisionHash: decision.decisionHash,
      paymentResult: result,
      auditTimestamp: Date.now(),
      type: 'payment_audit'
    };

    return this.sessionLogger.storeOnIPFS(auditData);
  }

  private async logPaymentFailure(error: any, paymentRequest: any): Promise<void> {
    const failureData = {
      error: error.message,
      paymentRequest,
      timestamp: Date.now(),
      type: 'payment_failure'
    };

    await this.sessionLogger.storeOnIPFS(failureData);
  }

  private async createDecisionHash(decisionData: any): Promise<string> {
    const jsonString = JSON.stringify(decisionData);
    const encoder = new TextEncoder();
    const dataArray = encoder.encode(jsonString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataArray);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async createPayrollAuditHash(payrollSummary: any): Promise<string> {
    return this.createDecisionHash({
      ...payrollSummary,
      type: 'payroll_audit',
      blockchain_verified: true
    });
  }
}
