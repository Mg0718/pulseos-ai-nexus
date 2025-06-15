
export interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label: string };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export const WorkflowTemplates: WorkflowTemplate[] = [
  {
    id: 'email-automation',
    name: 'Email Marketing Automation',
    description: 'Automated email campaigns with user segmentation and follow-ups',
    category: 'Communication',
    nodes: [
      { id: 'trigger-1', type: 'trigger', position: { x: 100, y: 100 }, data: { label: 'New Subscriber' } },
      { id: 'action-1', type: 'action', position: { x: 300, y: 100 }, data: { label: 'Send Welcome Email' } },
      { id: 'delay-1', type: 'delay', position: { x: 500, y: 100 }, data: { label: 'Wait 3 Days' } },
      { id: 'action-2', type: 'action', position: { x: 700, y: 100 }, data: { label: 'Send Follow-up' } }
    ],
    edges: [
      { id: 'e1-2', source: 'trigger-1', target: 'action-1' },
      { id: 'e2-3', source: 'action-1', target: 'delay-1' },
      { id: 'e3-4', source: 'delay-1', target: 'action-2' }
    ]
  },
  {
    id: 'data-sync',
    name: 'Database Synchronization',
    description: 'Sync data between multiple databases and external APIs',
    category: 'Data Processing',
    nodes: [
      { id: 'trigger-2', type: 'trigger', position: { x: 100, y: 100 }, data: { label: 'Schedule Trigger' } },
      { id: 'action-3', type: 'action', position: { x: 300, y: 100 }, data: { label: 'Fetch Data' } },
      { id: 'condition-1', type: 'condition', position: { x: 500, y: 100 }, data: { label: 'Data Valid?' } },
      { id: 'action-4', type: 'action', position: { x: 700, y: 50 }, data: { label: 'Update Database' } },
      { id: 'action-5', type: 'action', position: { x: 700, y: 150 }, data: { label: 'Log Error' } }
    ],
    edges: [
      { id: 'e1-3', source: 'trigger-2', target: 'action-3' },
      { id: 'e3-c1', source: 'action-3', target: 'condition-1' },
      { id: 'ec1-4', source: 'condition-1', target: 'action-4' },
      { id: 'ec1-5', source: 'condition-1', target: 'action-5' }
    ]
  },
  {
    id: 'customer-support',
    name: 'Customer Support Ticket Routing',
    description: 'Automatically route and assign support tickets based on priority and expertise',
    category: 'Customer Support',
    nodes: [
      { id: 'trigger-3', type: 'trigger', position: { x: 100, y: 100 }, data: { label: 'New Ticket' } },
      { id: 'condition-2', type: 'condition', position: { x: 300, y: 100 }, data: { label: 'Priority Level?' } },
      { id: 'action-6', type: 'action', position: { x: 500, y: 50 }, data: { label: 'Assign to Senior' } },
      { id: 'action-7', type: 'action', position: { x: 500, y: 150 }, data: { label: 'Assign to Junior' } }
    ],
    edges: [
      { id: 'e1-c2', source: 'trigger-3', target: 'condition-2' },
      { id: 'ec2-6', source: 'condition-2', target: 'action-6' },
      { id: 'ec2-7', source: 'condition-2', target: 'action-7' }
    ]
  },
  {
    id: 'inventory-management',
    name: 'Inventory Restock Alert',
    description: 'Monitor inventory levels and automatically create restock orders',
    category: 'E-commerce',
    nodes: [
      { id: 'trigger-4', type: 'trigger', position: { x: 100, y: 100 }, data: { label: 'Inventory Check' } },
      { id: 'condition-3', type: 'condition', position: { x: 300, y: 100 }, data: { label: 'Low Stock?' } },
      { id: 'action-8', type: 'action', position: { x: 500, y: 100 }, data: { label: 'Create Purchase Order' } },
      { id: 'action-9', type: 'action', position: { x: 700, y: 100 }, data: { label: 'Notify Manager' } }
    ],
    edges: [
      { id: 'e1-c3', source: 'trigger-4', target: 'condition-3' },
      { id: 'ec3-8', source: 'condition-3', target: 'action-8' },
      { id: 'e8-9', source: 'action-8', target: 'action-9' }
    ]
  }
];

export const getTemplateById = (id: string): WorkflowTemplate | undefined => {
  return WorkflowTemplates.find(template => template.id === id);
};
