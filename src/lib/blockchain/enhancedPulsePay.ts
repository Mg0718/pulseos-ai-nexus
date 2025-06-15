
import { PulsePayManager } from './pulsePay';
import { PaymentContract, EscrowDetails, PaymentMilestone } from './types';
import { ContractManager } from './contractManager';
import { PaymentProcessor } from './paymentProcessor';
import { AutomationManager } from './automationManager';
import { TaxOptimizer } from './taxOptimizer';
import { BlockchainStorageService } from './storageService';

export class EnhancedBlockchainPulsePay extends PulsePayManager {
  private contractManager: ContractManager;
  private paymentProcessor: PaymentProcessor;
  private automationManager: AutomationManager;
  private taxOptimizer: TaxOptimizer;
  private storageService: BlockchainStorageService;

  constructor() {
    super();
    this.contractManager = new ContractManager();
    this.paymentProcessor = new PaymentProcessor();
    this.automationManager = new AutomationManager();
    this.taxOptimizer = new TaxOptimizer();
    this.storageService = new BlockchainStorageService();
  }

  // Expose storage service methods publicly
  public async storeOnIPFS(data: any): Promise<string> {
    return this.storageService.storeOnIPFS(data);
  }

  // Override parent methods to use new type definitions
  async createPaymentContract(
    payee: string, 
    totalAmount: string, 
    milestones: Omit<PaymentMilestone, 'id' | 'status'>[]
  ): Promise<PaymentContract> {
    return this.contractManager.createPaymentContract(payee, totalAmount, milestones);
  }

  async setupEscrow(contractId: string, amount: string): Promise<EscrowDetails> {
    return this.contractManager.setupEscrow(contractId, amount);
  }

  // Additional contract management methods
  async processMilestonePayment(contractId: string, milestoneId: string): Promise<PaymentMilestone> {
    return this.contractManager.processMilestonePayment(contractId, milestoneId);
  }

  async disputeMilestone(contractId: string, milestoneId: string, reason: string): Promise<PaymentMilestone> {
    return this.contractManager.disputeMilestone(contractId, milestoneId, reason);
  }

  async resolveDispute(contractId: string, milestoneId: string, resolution: string): Promise<PaymentMilestone> {
    return this.contractManager.resolveDispute(contractId, milestoneId, resolution);
  }

  async processRefund(contractId: string, amount: string): Promise<EscrowDetails> {
    return this.contractManager.processRefund(contractId, amount);
  }

  async terminateContract(contractId: string): Promise<PaymentContract> {
    return this.contractManager.terminateContract(contractId);
  }

  // Payment processing methods
  async processBlockchainManagedPayment(payee: string, amount: string, currency: string = 'USD') {
    return this.paymentProcessor.processBlockchainManagedPayment(payee, amount, currency);
  }

  async processBlockchainPayroll(employees: any[]) {
    return this.paymentProcessor.processBlockchainPayroll(employees);
  }

  // Automation methods
  async processAutomatedPayroll(payrollData: any) {
    return this.automationManager.processAutomatedPayroll(payrollData);
  }

  async processInvoiceAutomation(invoiceData: any) {
    return this.automationManager.processInvoiceAutomation(invoiceData);
  }

  // Tax optimization methods
  async calculateTaxOptimization(transactionData: any) {
    return this.taxOptimizer.calculateTaxOptimization(transactionData);
  }
}
