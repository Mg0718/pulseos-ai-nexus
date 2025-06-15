
# PulseOS API Reference

## Authentication

All API calls require authentication via Supabase Auth. Include the JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Edge Functions

### Flow Execution API

**Endpoint**: `/functions/v1/execute-flow-trigger`

**Method**: POST

**Request Body**:
```json
{
  "flow_id": "uuid",
  "trigger_payload": {
    "trigger_type": "string",
    "data": {}
  }
}
```

**Response**:
```json
{
  "execution_id": "uuid",
  "status": "completed|failed|running",
  "execution_time_ms": 1500,
  "output_data": {},
  "error_message": "string"
}
```

### Compliance Audit API

**Endpoint**: `/functions/v1/run-compliance-audit`

**Method**: POST

**Request Body**:
```json
{
  "org_id": "uuid",
  "regions": ["GDPR", "SOC2"]
}
```

**Response**:
```json
{
  "compliance_score": 85,
  "audit_results": [
    {
      "check": "string",
      "status": "pass|fail|warning",
      "details": "string"
    }
  ],
  "recommendations": ["string"]
}
```

## Database Tables

### Key Table Structures

#### flows
- `id` (uuid, primary key)
- `name` (text)
- `description` (text)
- `flow_definition` (jsonb)
- `status` (text: draft|active|inactive)
- `org_id` (uuid)
- `created_by` (uuid)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### flow_runs
- `id` (uuid, primary key)
- `flow_id` (uuid, foreign key)
- `status` (text: running|completed|failed)
- `input_data` (jsonb)
- `output_data` (jsonb)
- `execution_time_ms` (integer)
- `error_message` (text)
- `started_at` (timestamp)
- `completed_at` (timestamp)

#### profiles
- `id` (uuid, primary key, references auth.users)
- `full_name` (text)
- `avatar_url` (text)
- `job_title` (text)
- `department` (text)
- `hire_date` (date)
- `employment_status` (text)
- `created_at` (timestamp)

#### teams
- `id` (uuid, primary key)
- `name` (text)
- `description` (text)
- `created_by` (uuid)
- `created_at` (timestamp)

#### team_members
- `id` (uuid, primary key)
- `team_id` (uuid, foreign key)
- `user_id` (uuid, foreign key)
- `role` (enum: member|lead|admin)
- `joined_at` (timestamp)

## Real-time Subscriptions

### Available Channels

#### audit_events
Listen for compliance events:
```javascript
supabase
  .channel('audit_events')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'audit_events'
  }, callback)
  .subscribe()
```

#### flow_runs
Monitor workflow executions:
```javascript
supabase
  .channel('flow_runs')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'flow_runs'
  }, callback)
  .subscribe()
```

#### chat_messages
Real-time messaging:
```javascript
supabase
  .channel('chat_messages')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'chat_messages'
  }, callback)
  .subscribe()
```

## Row Level Security (RLS) Policies

### Standard User Policies
Most tables include these standard RLS policies:
- Users can only access their own data
- Organization-scoped data access
- Admin users have elevated permissions

### Example Policy Structure
```sql
-- Users can view their own records
CREATE POLICY "Users can view own data" ON table_name
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own records
CREATE POLICY "Users can insert own data" ON table_name
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## Custom Hooks

### useRealTimeEdgeFunctions
Centralized hook for Edge Function calls:
```javascript
const {
  runComplianceAudit,
  executeFlow,
  syncConnector,
  updatePresence
} = useRealTimeEdgeFunctions();
```

## Error Handling

### Standard Error Format
```json
{
  "error": {
    "message": "Human readable error message",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

### Common Error Codes
- `UNAUTHORIZED`: Invalid or missing authentication
- `FORBIDDEN`: Insufficient permissions
- `VALIDATION_ERROR`: Invalid request data
- `NOT_FOUND`: Resource not found
- `RATE_LIMITED`: Too many requests

## Rate Limiting

Edge Functions are subject to Supabase rate limits:
- Authenticated requests: 200 per minute
- Anonymous requests: 60 per minute
