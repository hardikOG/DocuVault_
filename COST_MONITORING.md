# Cost Monitoring & Alerts

## Overview
Proactive monitoring of infrastructure costs to avoid surprise bills and optimize resource usage.

## Monitoring Setup

### Render (Backend Hosting)
1. **Access Usage Dashboard**:
   - Navigate to Render dashboard → Account → Usage
   - Review current month's usage

2. **Set Up Alerts**:
   - Go to Account Settings → Billing
   - Enable email notifications for:
     - 50% of plan limit reached
     - 80% of plan limit reached
     - Approaching plan limit

3. **Monitor Metrics**:
   - Build minutes used
   - Bandwidth consumed
   - Instance hours
   - Database connections

### Neon (Database)
1. **Access Metrics**:
   - Neon Console → Project → Usage
   - Monitor:
     - Storage size
     - Compute hours
     - Data transfer
     - Active connections

2. **Set Limits**:
   - Enable auto-suspend for inactive databases
   - Set connection pooling limits (already configured)
   - Configure storage limits

3. **Alerts**:
   - Enable email notifications in project settings
   - Set thresholds:
     - Storage > 80% of quota
     - Compute hours > expected monthly usage
     - Connection spikes

### Cloudflare R2 (Storage)
1. **Monitor Usage**:
   - Cloudflare Dashboard → R2 → Metrics
   - Track:
     - Storage size (GB)
     - Class A operations (writes)
     - Class B operations (reads)
     - Data transfer

2. **Cost Optimization**:
   - Enable lifecycle rules for old files
   - Set up CDN caching to reduce reads
   - Monitor upload patterns

3. **Alerts**:
   - Cloudflare Notifications → Create Alert
   - Set thresholds:
     - Storage > 5GB
     - Monthly operations > expected
     - Unusual traffic patterns

### Vercel (Frontend Hosting)
1. **Usage Dashboard**:
   - Vercel Dashboard → Usage
   - Monitor:
     - Bandwidth
     - Build minutes
     - Function invocations
     - Edge requests

2. **Alerts**:
   - Settings → Notifications
   - Enable alerts for:
     - Bandwidth threshold
     - Build minute warnings
     - Plan limit approaching

## Cost Optimization Tips

### Backend
- Use Render's free tier for development/staging
- Optimize Docker image size
- Reduce build times with caching
- Monitor and fix memory leaks

### Database
- Enable auto-suspend for inactive periods
- Use connection pooling (already configured)
- Archive old data periodically
- Monitor slow queries

### Storage
- Implement file size limits (e.g., 10MB max)
- Use lifecycle rules to delete expired documents
- Enable CDN caching for downloads
- Compress files before upload

### Frontend
- Optimize bundle size
- Use Next.js image optimization
- Enable edge caching
- Minimize API calls

## Monthly Cost Checklist

- [ ] Review Render usage and costs
- [ ] Check Neon database metrics
- [ ] Monitor R2 storage and operations
- [ ] Review Vercel bandwidth usage
- [ ] Identify cost optimization opportunities
- [ ] Update cost projections for scaling

## Expected Monthly Costs (Free Tier)

| Service | Free Tier Limits | Estimated Usage |
|---------|-----------------|-----------------|
| Render | 750 hours/month | ~720 hours (1 instance) |
| Neon | 0.5GB storage, 100 hours compute | ~50 hours, <0.5GB |
| R2 | 10GB storage, 1M Class A, 10M Class B | <1GB, minimal ops |
| Vercel | 100GB bandwidth, 6000 build mins | <10GB, <100 mins |

**Total**: $0/month (within free tiers)

## Scaling Cost Estimates

When you outgrow free tiers:
- **Render**: ~$7-25/month (Starter/Standard plan)
- **Neon**: ~$19/month (Scale plan)
- **R2**: ~$0.015/GB/month + operations
- **Vercel**: ~$20/month (Pro plan)

**Estimated**: $50-70/month for small production app

## Alert Configuration Script

```bash
# Set up environment variables for cost thresholds
export RENDER_COST_ALERT_THRESHOLD=50
export NEON_STORAGE_ALERT_GB=5
export R2_STORAGE_ALERT_GB=5
export VERCEL_BANDWIDTH_ALERT_GB=80
```

## Emergency Cost Control

If costs spike unexpectedly:
1. Check for DDoS or abuse (rate limiting should prevent this)
2. Review recent deployments for issues
3. Temporarily disable non-critical features
4. Scale down instances if possible
5. Contact support for billing review
