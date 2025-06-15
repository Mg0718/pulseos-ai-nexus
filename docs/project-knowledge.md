
# PulseOS Project Knowledge Base

## Project Overview

PulseOS is an AI-powered business operating system designed as "The OS for modern teams." It's built as a comprehensive platform that integrates multiple business modules into a unified interface, leveraging AI automation and modern web technologies.

## Technology Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/UI component library
- **Animation**: Framer Motion for micro-interactions
- **Icons**: Lucide React
- **State Management**: React Query (TanStack Query) for server state
- **Routing**: React Router DOM

### Backend & Infrastructure
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Real-time subscriptions
- **Edge Functions**: Supabase Edge Functions for serverless logic
- **File Storage**: Supabase Storage (configured but not actively used)

### Workflow Engine
- **Flow Builder**: ReactFlow (@xyflow/react) for visual workflow creation
- **Node System**: Custom node types (Trigger, Action, Condition, Delay)
- **Automation**: Custom flow execution engine via Edge Functions

## Architecture Patterns

### Component Architecture
- **Atomic Design**: Components organized by complexity (atoms, molecules, organisms)
- **Feature-based Structure**: Modules organized by business domain
- **Layout Components**: Reusable shell layouts (ShellLayout)
- **Custom Hooks**: Centralized business logic in hooks

### Data Flow
- **Server State**: React Query for API data management
- **Client State**: React useState and useContext for UI state
- **Real-time Updates**: Supabase subscriptions for live data
- **Authentication Context**: Centralized auth state management

### Routing Strategy
- **Protected Routes**: Authentication-gated pages
- **Public Routes**: Landing and auth pages
- **Nested Routing**: Module-specific sub-routes
- **Dynamic Imports**: Code splitting for better performance

## Implemented Modules

### 1. Authentication & Access Control
**Status**: ✅ Implemented
- Supabase-based authentication
- Email/password signup and login
- Protected route system
- User profile management
- Session persistence

### 2. PulseFlow - Visual Workflow Automation
**Status**: ✅ Fully Implemented
- **Visual Flow Builder**: Drag-and-drop interface using ReactFlow
- **Node Types**:
  - Trigger Nodes (purple) - Event initiators
  - Action Nodes (green) - Process executors
  - Condition Nodes (orange) - Logic branches
  - Delay Nodes (blue) - Time-based pauses
- **Configuration System**: Right-drawer configuration for each node
- **Flow Execution**: Edge function-based automation engine
- **Templates**: Pre-built workflow templates
- **History**: Execution logs and run tracking

### 3. People & TeamOps
**Status**: ✅ Comprehensive Implementation
- **Employee Profiles**: Complete profile management system
- **Team Management**: Team creation and member assignment
- **Onboarding**: Multi-step onboarding workflows
- **Performance Management**: Goal setting and tracking
- **OKR System**: Objectives and Key Results with AI nudges
- **Feedback System**: 360-degree feedback collection
- **Leave Management**: Leave requests and balance tracking
- **Time Tracking**: Clock in/out with overtime calculation
- **Morale Tracking**: Team sentiment monitoring
- **Benefits Management**: Employee benefits enrollment

### 4. FinanceOps Suite
**Status**: ✅ Full Implementation
- **Invoice Management**: Creation, sending, and tracking
- **Payroll Processing**: Automated payroll runs
- **Financial Metrics**: Rule of 40, ROIC calculations
- **Transaction Tracking**: Payment processing integration
- **Billing Models**: Flexible pricing structures
- **Financial Analytics**: Revenue and expense dashboards
- **Multi-currency Support**: USD and other currencies
- **Tax Calculations**: Automated tax computation

### 5. PulseComms
**Status**: ✅ Implemented
- **Chat System**: Real-time messaging
- **Channels**: Public and private communication channels
- **Message Threading**: Organized conversation structure
- **AI Enhancement**: GPT-powered message suggestions
- **Presence Status**: Online/offline user status

### 6. Analytics & Insights
**Status**: ✅ Dashboard Implementation
- **Role-based Dashboards**: Customized views per user role
- **Data Visualization**: Charts using Recharts library
- **Metrics Tracking**: Custom analytics data collection
- **Performance Indicators**: KPI monitoring

### 7. Innovation Hub
**Status**: ✅ Basic Implementation
- **Idea Submission**: Employee innovation suggestions
- **AI Voting**: Automated idea evaluation
- **Status Tracking**: Idea progression monitoring

### 8. Admin & Settings
**Status**: ✅ Core Implementation
- **User Management**: Admin user controls
- **System Configuration**: Application settings
- **Module Management**: Enable/disable features

### 9. Integration & Middleware (PulseSync)
**Status**: ✅ Framework Implemented
- **Connector System**: External service integration
- **OAuth Management**: Third-party authentication
- **Sync Jobs**: Data synchronization tracking
- **Real-time Edge Functions**: Live data processing

### 10. Compliance & Risk (PulseCompliance)
**Status**: ✅ Framework Implemented
- **Audit Events**: Compliance event tracking
- **Policy Management**: Document and policy storage
- **Risk Assessment**: Automated compliance scoring
- **Task Management**: Compliance task assignment

## Database Schema

### Core Tables
- **profiles**: User profile information
- **teams**: Team organization structure
- **team_members**: Team membership relations

### Finance Tables
- **invoices**: Invoice management
- **transactions**: Payment tracking
- **payroll**: Employee compensation
- **financial_metrics**: Calculated business metrics

### Workflow Tables
- **flows**: Workflow definitions
- **flow_runs**: Execution history
- **automations**: Automation configurations

### Communication Tables
- **chat_rooms**: Communication channels
- **chat_messages**: Message storage
- **channels**: Channel definitions
- **messages**: Message threading

### HR Tables
- **okrs**: Objectives and Key Results
- **performance_reviews**: Review cycles
- **feedback_entries**: Feedback collection
- **time_entries**: Time tracking
- **morale_entries**: Team sentiment

### Compliance Tables
- **policies**: Policy documents
- **audit_events**: Compliance events
- **compliance_tasks**: Task management

## Edge Functions

### 1. Flow Execution (`execute-flow-trigger`)
- Processes workflow automation
- Handles node execution logic
- Returns execution results and timing

### 2. Compliance Audit (`run-compliance-audit`)
- Automated compliance checking
- Risk assessment calculations
- Audit report generation

### 3. Data Synchronization (`sync-connector-data`)
- Third-party data integration
- Scheduled sync operations
- Error handling and retry logic

### 4. Presence Management (`update-presence-status`)
- Real-time user status updates
- Online/offline state management

### 5. Message Processing (`on-message-sent`)
- Chat message handling
- AI enhancement processing

### 6. Policy Notifications (`on-new-policy`)
- Policy update notifications
- Compliance alerts

## Real-time Features

### Implemented Subscriptions
- **Audit Events**: Critical compliance alerts
- **Compliance Tasks**: High-priority task notifications
- **Presence Updates**: User status changes
- **Chat Messages**: Real-time messaging
- **Flow Executions**: Workflow completion notifications

## UI/UX Design System

### Color Palette
- **Primary**: Purple gradient (#8B5CF6 to #A855F7)
- **Background**: Dark slate with transparency layers
- **Accent Colors**: Module-specific color coding
- **Status Colors**: Green (success), Orange (warning), Red (error)

### Component Patterns
- **Glass Morphism**: Backdrop blur effects throughout
- **Micro-animations**: Framer Motion for state transitions
- **Responsive Design**: Mobile-first approach
- **Dark Theme**: Consistent dark mode implementation

### Navigation
- **Floating Sidebar**: Always-accessible module navigation
- **Breadcrumb System**: Context-aware navigation
- **Tab-based Interfaces**: Organized content sections

## Security Implementation

### Authentication
- **Row Level Security (RLS)**: Database-level access control
- **JWT Tokens**: Secure session management
- **Protected Routes**: Frontend route protection

### Data Protection
- **User Isolation**: Data scoped to authenticated users
- **Audit Logging**: Comprehensive activity tracking
- **Encryption**: Supabase-managed encryption at rest

## Performance Optimizations

### Code Splitting
- **Route-based Splitting**: Lazy-loaded page components
- **Component Chunking**: Efficient bundle management

### Data Management
- **React Query**: Intelligent caching and synchronization
- **Real-time Subscriptions**: Efficient data updates
- **Pagination**: Large dataset handling

## Development Patterns

### Error Handling
- **Toast Notifications**: User-friendly error messages
- **Error Boundaries**: Component-level error catching
- **Validation**: Form and data validation

### State Management
- **Server State**: React Query for API data
- **Client State**: React hooks for UI state
- **Context Providers**: Shared state management

### Testing Strategy
- **TypeScript**: Static type checking
- **Component Testing**: Isolated component verification
- **Integration Testing**: End-to-end workflow testing

## Deployment & Infrastructure

### Build Process
- **Vite**: Fast development and production builds
- **TypeScript**: Compile-time error checking
- **ESLint**: Code quality enforcement

### Environment Configuration
- **Supabase Integration**: Database and authentication
- **Environment Variables**: Secure configuration management
- **CORS Configuration**: Cross-origin request handling

## Future Expansion Areas

### Identified Extension Points
1. **Mobile Applications**: React Native implementation
2. **Advanced AI**: Enhanced GPT integration
3. **Blockchain Integration**: Crypto payment processing
4. **Advanced Analytics**: Machine learning insights
5. **Third-party Integrations**: Extended connector library

### Scalability Considerations
- **Database Optimization**: Query performance tuning
- **Caching Strategy**: Redis implementation
- **Load Balancing**: Multi-region deployment
- **Microservices**: Service decomposition

## Key Design Decisions

### Technology Choices
- **React + TypeScript**: Type safety and modern development
- **Supabase**: Rapid backend development with real-time features
- **Tailwind CSS**: Utility-first styling for consistency
- **ReactFlow**: Specialized workflow visualization

### Architecture Decisions
- **Monolithic Frontend**: Single-page application approach
- **Serverless Backend**: Edge functions for scalability
- **Real-time First**: Live data updates throughout
- **Component-driven**: Reusable UI component library

### Data Modeling Decisions
- **UUID Primary Keys**: Distributed system compatibility
- **JSONB Storage**: Flexible schema evolution
- **Audit Trail**: Comprehensive change tracking
- **Soft Deletes**: Data preservation for compliance

## Integration Capabilities

### Current Integrations
- **Supabase**: Full-stack backend services
- **Payment Processing**: Stripe and Razorpay
- **Email Services**: Transactional email support
- **File Storage**: Document and media management

### Integration Framework
- **OAuth Support**: Third-party authentication
- **Webhook System**: Event-driven integrations
- **API Gateway**: Centralized external API management
- **Data Transformation**: ETL pipeline support

This knowledge base represents the current state of PulseOS implementation and serves as a foundation for future development and maintenance efforts.
