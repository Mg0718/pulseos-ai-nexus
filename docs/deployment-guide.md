
# PulseOS Deployment Guide

## Prerequisites

- Node.js 18+ and npm/yarn
- Supabase CLI
- Git

## Environment Setup

### Required Environment Variables

Create a `.env.local` file with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Configuration

1. **Create Supabase Project**:
   ```bash
   npx supabase init
   npx supabase start
   ```

2. **Run Migrations**:
   ```bash
   npx supabase db reset
   ```

3. **Deploy Edge Functions**:
   ```bash
   npx supabase functions deploy execute-flow-trigger
   npx supabase functions deploy run-compliance-audit
   npx supabase functions deploy sync-connector-data
   npx supabase functions deploy update-presence-status
   ```

## Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Start Supabase Local**:
   ```bash
   npx supabase start
   ```

## Production Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Build Project**:
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**:
   ```bash
   npx vercel --prod
   ```

### Supabase Production

1. **Link to Production Project**:
   ```bash
   npx supabase link --project-ref your-project-ref
   ```

2. **Deploy Database Changes**:
   ```bash
   npx supabase db push
   ```

3. **Deploy Edge Functions**:
   ```bash
   npx supabase functions deploy --project-ref your-project-ref
   ```

## Configuration Checklist

### Authentication Setup
- [ ] Configure authentication providers in Supabase Dashboard
- [ ] Set up email templates
- [ ] Configure redirect URLs
- [ ] Enable Row Level Security on all tables

### Database Setup
- [ ] Run all migrations
- [ ] Verify RLS policies
- [ ] Set up database triggers
- [ ] Configure backups

### Edge Functions
- [ ] Deploy all functions
- [ ] Set environment secrets
- [ ] Test function endpoints
- [ ] Monitor function logs

### Frontend Configuration
- [ ] Set production environment variables
- [ ] Configure custom domain
- [ ] Enable HTTPS
- [ ] Set up monitoring

## Monitoring & Maintenance

### Health Checks
- Supabase dashboard for database health
- Edge function logs for serverless monitoring
- Frontend error tracking with Sentry (optional)

### Backup Strategy
- Supabase automatic backups (daily)
- Manual database exports for critical data
- Version control for all configuration

### Security Considerations
- Regular security updates
- API key rotation
- Monitor for unusual activity
- Keep dependencies updated

## Troubleshooting

### Common Issues

1. **Authentication Errors**:
   - Verify environment variables
   - Check Supabase Auth configuration
   - Ensure RLS policies are correct

2. **Database Connection Issues**:
   - Verify database URL
   - Check connection pooling limits
   - Monitor for connection leaks

3. **Edge Function Errors**:
   - Check function logs in Supabase dashboard
   - Verify environment secrets
   - Test with curl commands

### Performance Optimization

1. **Database**:
   - Add indexes for frequently queried columns
   - Optimize RLS policies
   - Use database functions for complex queries

2. **Frontend**:
   - Enable code splitting
   - Optimize bundle size
   - Use React Query for efficient caching

3. **Edge Functions**:
   - Minimize cold start time
   - Use connection pooling
   - Implement proper error handling

## Scaling Considerations

### Database Scaling
- Monitor query performance
- Consider read replicas for heavy read workloads
- Implement caching strategies

### Function Scaling
- Monitor invocation patterns
- Optimize function memory allocation
- Consider function composition for complex workflows

### Frontend Scaling
- Use CDN for static assets
- Implement proper caching headers
- Consider server-side rendering for SEO
