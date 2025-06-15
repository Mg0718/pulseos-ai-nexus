
import { Node, Edge } from '@xyflow/react';

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: Node[];
  edges: Edge[];
}

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'employee-onboarding',
    name: 'Employee Onboarding',
    description: 'Automate the complete employee onboarding process from welcome email to account setup',
    category: 'HR',
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: { 
          label: 'New Employee Added',
          triggerType: 'employee_created',
          configured: true
        }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 400, y: 100 },
        data: { 
          label: 'Send Welcome Email',
          actionType: 'send_email',
          emailSubject: 'Welcome to the team!',
          emailBody: 'Welcome aboard! We are excited to have you join our team.',
          configured: true
        }
      },
      {
        id: 'delay-1',
        type: 'delay',
        position: { x: 700, y: 100 },
        data: { 
          label: 'Wait 1 Day',
          duration: 1,
          unit: 'seconds',
          configured: true
        }
      },
      {
        id: 'action-2',
        type: 'action',
        position: { x: 1000, y: 100 },
        data: { 
          label: 'Create Employee Record',
          actionType: 'create_record',
          configured: true
        }
      }
    ],
    edges: [
      {
        id: 'e1-2',
        source: 'trigger-1',
        target: 'action-1'
      },
      {
        id: 'e2-3',
        source: 'action-1',
        target: 'delay-1'
      },
      {
        id: 'e3-4',
        source: 'delay-1',
        target: 'action-2'
      }
    ]
  },
  {
    id: 'customer-support',
    name: 'Customer Support Ticket',
    description: 'Route and escalate support tickets based on priority and department',
    category: 'Support',
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: { 
          label: 'Support Ticket Created',
          triggerType: 'ticket_created',
          configured: true
        }
      },
      {
        id: 'condition-1',
        type: 'condition',
        position: { x: 400, y: 100 },
        data: { 
          label: 'Check Priority',
          field: 'priority',
          operator: 'equals',
          value: 'high',
          configured: true
        }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 700, y: 50 },
        data: { 
          label: 'Escalate to Manager',
          actionType: 'send_email',
          emailSubject: 'High Priority Ticket Alert',
          configured: true
        }
      },
      {
        id: 'action-2',
        type: 'action',
        position: { x: 700, y: 150 },
        data: { 
          label: 'Assign to Agent',
          actionType: 'log_message',
          message: 'Ticket assigned to available agent',
          configured: true
        }
      }
    ],
    edges: [
      {
        id: 'e1-2',
        source: 'trigger-1',
        target: 'condition-1'
      },
      {
        id: 'e2-3',
        source: 'condition-1',
        target: 'action-1',
        sourceHandle: 'true'
      },
      {
        id: 'e2-4',
        source: 'condition-1',
        target: 'action-2',
        sourceHandle: 'false'
      }
    ]
  },
  {
    id: 'invoice-processing',
    name: 'Invoice Processing',
    description: 'Smart invoice approval workflow with automatic routing and payment processing',
    category: 'Finance',
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: { 
          label: 'Invoice Received',
          triggerType: 'invoice_received',
          configured: true
        }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 400, y: 100 },
        data: { 
          label: 'Log Invoice',
          actionType: 'log_message',
          message: 'New invoice received and logged',
          configured: true
        }
      },
      {
        id: 'condition-1',
        type: 'condition',
        position: { x: 700, y: 100 },
        data: { 
          label: 'Check Amount',
          field: 'amount',
          operator: 'greater_than',
          value: '1000',
          configured: true
        }
      },
      {
        id: 'action-2',
        type: 'action',
        position: { x: 1000, y: 50 },
        data: { 
          label: 'Request Approval',
          actionType: 'send_email',
          emailSubject: 'Invoice Approval Required',
          configured: true
        }
      },
      {
        id: 'action-3',
        type: 'action',
        position: { x: 1000, y: 150 },
        data: { 
          label: 'Auto Approve',
          actionType: 'log_message',
          message: 'Invoice auto-approved (under $1000)',
          configured: true
        }
      }
    ],
    edges: [
      {
        id: 'e1-2',
        source: 'trigger-1',
        target: 'action-1'
      },
      {
        id: 'e2-3',
        source: 'action-1',
        target: 'condition-1'
      },
      {
        id: 'e3-4',
        source: 'condition-1',
        target: 'action-2',
        sourceHandle: 'true'
      },
      {
        id: 'e3-5',
        source: 'condition-1',
        target: 'action-3',
        sourceHandle: 'false'
      }
    ]
  },
  {
    id: 'lead-qualification',
    name: 'Lead Qualification',
    description: 'Score and qualify leads automatically based on behavior and demographics',
    category: 'Sales',
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: { 
          label: 'Lead Captured',
          triggerType: 'lead_captured',
          configured: true
        }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 400, y: 100 },
        data: { 
          label: 'Score Lead',
          actionType: 'log_message',
          message: 'Lead scored and categorized',
          configured: true
        }
      },
      {
        id: 'condition-1',
        type: 'condition',
        position: { x: 700, y: 100 },
        data: { 
          label: 'Check Score',
          field: 'score',
          operator: 'greater_than',
          value: '75',
          configured: true
        }
      },
      {
        id: 'action-2',
        type: 'action',
        position: { x: 1000, y: 50 },
        data: { 
          label: 'Assign to Sales',
          actionType: 'send_email',
          emailSubject: 'High Quality Lead Alert',
          configured: true
        }
      },
      {
        id: 'action-3',
        type: 'action',
        position: { x: 1000, y: 150 },
        data: { 
          label: 'Add to Nurturing',
          actionType: 'log_message',
          message: 'Lead added to nurturing campaign',
          configured: true
        }
      }
    ],
    edges: [
      {
        id: 'e1-2',
        source: 'trigger-1',
        target: 'action-1'
      },
      {
        id: 'e2-3',
        source: 'action-1',
        target: 'condition-1'
      },
      {
        id: 'e3-4',
        source: 'condition-1',
        target: 'action-2',
        sourceHandle: 'true'
      },
      {
        id: 'e3-5',
        source: 'condition-1',
        target: 'action-3',
        sourceHandle: 'false'
      }
    ]
  },
  {
    id: 'meeting-scheduler',
    name: 'Meeting Scheduler',
    description: 'Automatically schedule meetings and send calendar invites with availability checks',
    category: 'Productivity',
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: { 
          label: 'Meeting Request',
          triggerType: 'meeting_request',
          configured: true
        }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 400, y: 100 },
        data: { 
          label: 'Check Availability',
          actionType: 'log_message',
          message: 'Checking calendar availability',
          configured: true
        }
      },
      {
        id: 'delay-1',
        type: 'delay',
        position: { x: 700, y: 100 },
        data: { 
          label: 'Processing Time',
          duration: 2,
          unit: 'seconds',
          configured: true
        }
      },
      {
        id: 'action-2',
        type: 'action',
        position: { x: 1000, y: 100 },
        data: { 
          label: 'Send Calendar Invite',
          actionType: 'send_email',
          emailSubject: 'Meeting Invitation',
          configured: true
        }
      }
    ],
    edges: [
      {
        id: 'e1-2',
        source: 'trigger-1',
        target: 'action-1'
      },
      {
        id: 'e2-3',
        source: 'action-1',
        target: 'delay-1'
      },
      {
        id: 'e3-4',
        source: 'delay-1',
        target: 'action-2'
      }
    ]
  },
  {
    id: 'document-approval',
    name: 'Document Approval',
    description: 'Multi-stage document review and approval process with version control',
    category: 'Legal',
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: { 
          label: 'Document Submitted',
          triggerType: 'document_submitted',
          configured: true
        }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 400, y: 100 },
        data: { 
          label: 'Route to Reviewers',
          actionType: 'send_email',
          emailSubject: 'Document Review Required',
          configured: true
        }
      },
      {
        id: 'delay-1',
        type: 'delay',
        position: { x: 700, y: 100 },
        data: { 
          label: 'Review Period',
          duration: 3,
          unit: 'seconds',
          configured: true
        }
      },
      {
        id: 'action-2',
        type: 'action',
        position: { x: 1000, y: 100 },
        data: { 
          label: 'Final Approval',
          actionType: 'log_message',
          message: 'Document approved and finalized',
          configured: true
        }
      }
    ],
    edges: [
      {
        id: 'e1-2',
        source: 'trigger-1',
        target: 'action-1'
      },
      {
        id: 'e2-3',
        source: 'action-1',
        target: 'delay-1'
      },
      {
        id: 'e3-4',
        source: 'delay-1',
        target: 'action-2'
      }
    ]
  }
];

export const getTemplateByCategory = (category: string) => {
  if (category === 'All') return workflowTemplates;
  return workflowTemplates.filter(template => template.category === category);
};

export const getTemplateById = (id: string) => {
  return workflowTemplates.find(template => template.id === id);
};
