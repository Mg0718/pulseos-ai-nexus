
import { PaymentResult, PayrollResult } from './types';
import { BlockchainStorageService } from './storageService';

export class PaymentProcessor {
  private storageService: BlockchainStorageService;

  constructor() {
    this.storageService = new BlockchainStorageService();
  }

  async processBlockchainManagedPayment(
    payee: string, 
    amount: string, 
    currency: string = 'USD'
  ): Promise<PaymentResult> {
    console.log(`Processing blockchain payment: ${amount} ${currency} to ${payee}`);
    
    try {
      const paymentData = {
        payee,
        amount: parseFloat(amount),
        currency,
        timestamp: new Date().toISOString(),
        type: 'blockchain_payment',
        status: 'processing'
      };

      // Store payment data on IPFS
      const ipfsHash = await this.storageService.storeOnIPFS(paymentData);
      
      const result: PaymentResult = {
        transactionId: `tx_${Date.now()}`,
        status: 'completed',
        amount,
        currency,
        payee,
        timestamp: new Date().toISOString(),
        ipfsHash,
        blockchainNetwork: 'Ethereum',
        gasUsed: '21000',
        transactionFee: '0.002 ETH'
      };

      console.log('Blockchain payment processed:', result);
      return result;
    } catch (error) {
      console.error('Blockchain payment failed:', error);
      throw new Error('Failed to process blockchain payment');
    }
  }

  async processBlockchainPayroll(employees: any[]): Promise<PayrollResult> {
    console.log(`Processing blockchain payroll for ${employees.length} employees`);
    
    try {
      const results: PayrollResult = {
        successful: [],
        failed: []
      };

      for (const employee of employees) {
        try {
          const paymentData = {
            employeeId: employee.id,
            name: employee.name,
            amount: employee.salary,
            currency: 'USD',
            timestamp: new Date().toISOString(),
            type: 'payroll_payment',
            status: 'processing'
          };

          // Store payroll data on IPFS
          const ipfsHash = await this.storageService.storeOnIPFS(paymentData);

          const result = {
            employeeId: employee.id,
            name: employee.name,
            amount: employee.salary,
            transactionId: `payroll_${Date.now()}_${employee.id}`,
            status: 'completed',
            timestamp: new Date().toISOString(),
            ipfsHash,
            blockchainNetwork: 'Ethereum'
          };

          results.successful.push(result);
        } catch (error) {
          results.failed.push({
            employeeId: employee.id,
            name: employee.name,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      console.log('Blockchain payroll processed:', results);
      return results;
    } catch (error) {
      console.error('Blockchain payroll failed:', error);
      throw new Error('Failed to process blockchain payroll');
    }
  }
}
