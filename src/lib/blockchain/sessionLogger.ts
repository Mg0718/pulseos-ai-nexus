import { Web3Provider } from './web3Provider';
import { BLOCKCHAIN_CONFIG } from './config';

export interface LoginSession {
  sessionId: string;
  userId: string;
  loginTimestamp: number;
  ipAddress: string;
  userAgent: string;
  deviceFingerprint: string;
  blockchainHash: string;
}

export interface PayrollDecision {
  payrollId: string;
  employeeId: string;
  amount: string;
  currency: string;
  decisionTimestamp: number;
  approvalHash: string;
  paymentProcessorUsed: 'stripe' | 'razorpay';
  blockchainSignature: string;
}

export class BlockchainSessionLogger {
  private web3Provider: Web3Provider;

  constructor() {
    this.web3Provider = Web3Provider.getInstance();
  }

  // Log user login sessions immutably on blockchain
  async logLoginSession(
    userId: string,
    ipAddress: string,
    userAgent: string
  ): Promise<LoginSession> {
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      const deviceFingerprint = await this.generateDeviceFingerprint(userAgent, ipAddress);
      
      const sessionData = {
        sessionId,
        userId,
        loginTimestamp: Date.now(),
        ipAddress,
        userAgent,
        deviceFingerprint
      };

      // Create blockchain hash for the session
      const blockchainHash = await this.createBlockchainHash(sessionData);
      
      // Store on IPFS for immutable record
      const ipfsHash = await this.storeOnIPFS({
        ...sessionData,
        blockchainHash,
        type: 'login_session'
      });

      console.log(`Login session logged on blockchain: ${blockchainHash}`);
      console.log(`Session data stored on IPFS: ${ipfsHash}`);

      return {
        ...sessionData,
        blockchainHash
      };
    } catch (error) {
      console.error('Failed to log login session:', error);
      throw error;
    }
  }

  // Create payroll decision on blockchain before payment processing
  async createPayrollDecision(
    employeeId: string,
    amount: string,
    currency: string,
    paymentProcessor: 'stripe' | 'razorpay'
  ): Promise<PayrollDecision> {
    try {
      const payrollId = `payroll_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      
      const decisionData = {
        payrollId,
        employeeId,
        amount,
        currency,
        decisionTimestamp: Date.now(),
        paymentProcessorUsed: paymentProcessor
      };

      // Generate approval hash based on payroll criteria
      const approvalHash = await this.generatePayrollApprovalHash(decisionData);
      
      // Create blockchain signature for immutable record
      const blockchainSignature = await this.signPayrollDecision(decisionData, approvalHash);

      // Store complete decision on blockchain
      const blockchainRecord = {
        ...decisionData,
        approvalHash,
        blockchainSignature,
        type: 'payroll_decision'
      };

      const ipfsHash = await this.storeOnIPFS(blockchainRecord);
      
      console.log(`Payroll decision created on blockchain: ${blockchainSignature}`);
      console.log(`Decision stored on IPFS: ${ipfsHash}`);

      return {
        ...decisionData,
        approvalHash,
        blockchainSignature
      };
    } catch (error) {
      console.error('Failed to create payroll decision:', error);
      throw error;
    }
  }

  // Verify payroll decision integrity
  async verifyPayrollDecision(payrollId: string): Promise<boolean> {
    try {
      // Retrieve from IPFS and verify blockchain signature
      const storedData = await this.retrieveFromIPFS(payrollId);
      return await this.verifyBlockchainSignature(storedData);
    } catch (error) {
      console.error('Failed to verify payroll decision:', error);
      return false;
    }
  }

  // Get comprehensive audit trail for security
  async getSecurityAuditTrail(userId: string, fromDate: Date, toDate: Date) {
    try {
      // This would query the blockchain for all user activities
      return {
        loginSessions: await this.getLoginSessions(userId, fromDate, toDate),
        payrollDecisions: await this.getPayrollDecisions(userId, fromDate, toDate),
        securityEvents: await this.getSecurityEvents(userId, fromDate, toDate),
        blockchainIntegrity: await this.verifyBlockchainIntegrity(userId)
      };
    } catch (error) {
      console.error('Failed to generate audit trail:', error);
      throw error;
    }
  }

  private async generateDeviceFingerprint(userAgent: string, ipAddress: string): Promise<string> {
    const fingerprintData = {
      userAgent,
      ipAddress,
      timestamp: Date.now(),
      randomSalt: Math.random().toString(36)
    };
    
    // Create a hash-based fingerprint
    return btoa(JSON.stringify(fingerprintData)).substring(0, 32);
  }

  private async createBlockchainHash(data: any): Promise<string> {
    // Simulate blockchain hash creation
    const jsonString = JSON.stringify(data);
    const encoder = new TextEncoder();
    const dataArray = encoder.encode(jsonString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataArray);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async generatePayrollApprovalHash(decisionData: any): Promise<string> {
    // Generate approval hash based on business logic
    const approvalCriteria = {
      ...decisionData,
      approvalTimestamp: Date.now(),
      approver: 'blockchain_system',
      criteria_met: true
    };
    
    return this.createBlockchainHash(approvalCriteria);
  }

  private async signPayrollDecision(decisionData: any, approvalHash: string): Promise<string> {
    const signatureData = {
      ...decisionData,
      approvalHash,
      signature_timestamp: Date.now()
    };
    
    return this.createBlockchainHash(signatureData);
  }

  public async storeOnIPFS(data: any): Promise<string> {
    // Simulate IPFS storage
    const hash = `Qm${Math.random().toString(36).substring(2, 15)}`;
    console.log('Stored on IPFS:', hash, data);
    return hash;
  }

  private async retrieveFromIPFS(identifier: string): Promise<any> {
    // Simulate IPFS retrieval
    return { verified: true, data: `Retrieved data for ${identifier}` };
  }

  private async verifyBlockchainSignature(data: any): Promise<boolean> {
    // Simulate signature verification
    return data.verified === true;
  }

  private async getLoginSessions(userId: string, fromDate: Date, toDate: Date): Promise<LoginSession[]> {
    // Simulate blockchain query for login sessions
    return [];
  }

  private async getPayrollDecisions(userId: string, fromDate: Date, toDate: Date): Promise<PayrollDecision[]> {
    // Simulate blockchain query for payroll decisions
    return [];
  }

  private async getSecurityEvents(userId: string, fromDate: Date, toDate: Date): Promise<any[]> {
    // Simulate blockchain query for security events
    return [];
  }

  private async verifyBlockchainIntegrity(userId: string): Promise<boolean> {
    // Simulate blockchain integrity verification
    return true;
  }
}
