# Disaster Recovery & Backup Strategy

## Recovery Objectives

- **RPO (Recovery Point Objective)**: 24 hours
  - Maximum acceptable data loss: 1 day
- **RTO (Recovery Time Objective)**: 2 hours
  - Maximum acceptable downtime: 2 hours

## Backup Strategy

### Database (Neon PostgreSQL)

#### Automatic Backups
- **Frequency**: Daily automatic backups (Neon feature)
- **Retention**: 7 days on free tier, 30 days on paid plans
- **Location**: Neon's backup infrastructure

#### Manual Backups
- **Frequency**: Weekly full export
- **Process**:
  ```bash
  # Export database to SQL file
  pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
  
  # Compress backup
  gzip backup_$(date +%Y%m%d).sql
  
  # Store in secure location (e.g., Google Drive, S3)
  ```

#### Testing Recovery
- **Frequency**: Monthly
- **Process**:
  1. Create test database instance
  2. Restore from latest backup
  3. Verify data integrity
  4. Test application connectivity
  5. Document recovery time
  6. Delete test instance

### File Storage (Cloudflare R2)

#### Lifecycle Rules
- **Setup**: Enable R2 lifecycle policies
- **Rules**:
  - Move files to infrequent access after 90 days
  - Delete expired documents automatically
  - Archive old files to cheaper storage

#### Backup Strategy
- **Frequency**: Monthly full export (optional for critical files)
- **Process**:
  ```bash
  # Use rclone or AWS CLI to sync R2 to backup location
  aws s3 sync s3://docuvault s3://docuvault-backup --endpoint-url $R2_ENDPOINT
  ```

#### Versioning
- Enable R2 object versioning for critical files
- Retain 3 versions of each file
- Automatic cleanup of old versions after 30 days

### Application Code

#### Git Repository
- **Primary**: GitHub
- **Backup**: Automated daily exports to local/cloud storage
- **Tags**: Version tags for each release (v1.0.0, v1.1.0, etc.)

#### Environment Variables
- **Backup**: Encrypted copy stored securely offline
- **Update**: After each secrets rotation
- **Location**: Password-protected document or secrets manager

## Recovery Procedures

### Database Recovery

#### Scenario 1: Data Corruption
1. Identify corruption time from logs
2. Access Neon dashboard → Backups
3. Select backup before corruption
4. Restore to new database instance
5. Update `DATABASE_URL` in Render
6. Redeploy application
7. Verify data integrity
8. Switch DNS/traffic to new instance

**Estimated Time**: 30-60 minutes

#### Scenario 2: Accidental Deletion
1. Check if data is in recent backup
2. Restore specific tables from backup:
   ```bash
   pg_restore -t table_name backup.sql
   ```
3. Verify restored data
4. Update application if needed

**Estimated Time**: 15-30 minutes

### Storage Recovery

#### Scenario: Lost Files in R2
1. Check R2 versioning for file history
2. Restore from version history if available
3. If not versioned, restore from monthly backup
4. Regenerate missing files if possible
5. Notify affected users

**Estimated Time**: 1-2 hours

### Complete System Recovery

#### Scenario: Total Infrastructure Failure
1. **Database**:
   - Create new Neon database
   - Restore from latest backup
   - Update connection string

2. **Backend**:
   - Redeploy to Render from GitHub
   - Configure environment variables
   - Run migrations
   - Test health endpoint

3. **Frontend**:
   - Redeploy to Vercel from GitHub
   - Update backend URL
   - Test functionality

4. **Storage**:
   - Restore R2 bucket from backup
   - Verify file accessibility
   - Update CDN configuration

**Estimated Time**: 2-4 hours

## Backup Verification Checklist

### Monthly Tasks
- [ ] Verify automatic database backups exist
- [ ] Test database restore procedure
- [ ] Check R2 lifecycle rules are active
- [ ] Verify git repository is backed up
- [ ] Update environment variables backup
- [ ] Document any recovery issues

### Quarterly Tasks
- [ ] Full disaster recovery drill
- [ ] Update recovery documentation
- [ ] Review and update RPO/RTO targets
- [ ] Test complete system recovery
- [ ] Train team on recovery procedures

## Backup Storage Locations

| Data Type | Primary | Backup | Retention |
|-----------|---------|--------|-----------|
| Database | Neon | Manual exports | 30 days |
| Files | R2 | R2 versioning | 30 days |
| Code | GitHub | Local clone | Indefinite |
| Env Vars | Render | Encrypted doc | Current + 2 previous |
| Logs | Render/Vercel | Local archive | 90 days |

## Emergency Contacts

- **Neon Support**: support@neon.tech
- **Render Support**: support@render.com
- **Cloudflare Support**: Via dashboard
- **Vercel Support**: Via dashboard

## Recovery Documentation

After each recovery event:
1. Document what happened
2. Record recovery steps taken
3. Note actual recovery time
4. Identify improvements needed
5. Update this document
6. Share learnings with team
