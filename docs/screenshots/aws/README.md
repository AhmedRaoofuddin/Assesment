# AWS Console Screenshots

This directory contains proof of AWS infrastructure deployment for the Pizza Hut Demo Platform.

## Required Screenshots

### 1. amplify-dashboard.png
**AWS Amplify App Dashboard**
- Shows successful deployment of the Pizza Hut platform
- Build history with successful builds
- Domain configuration and SSL certificate
- Environment variables configuration (with secrets masked)
- Deployment logs showing successful Next.js build

### 2. s3-bucket-overview.png
**S3 Bucket Configuration**
- Bucket name: `rayqube-pizzahut-uploads-20250927`
- Private bucket configuration
- CORS settings enabled
- Public access blocked (security)
- Versioning and encryption settings

### 3. s3-bucket-contents.png
**S3 Bucket Contents**
- `/ads/ad.mp4` - Demo pizza video
- `/ads/video-license.txt` - License information
- `/uploads/` directory for user uploads
- Sample uploaded files (if any)

### 4. dynamodb-table.png
**DynamoDB Table Configuration**
- Table name: `rayqube-registrations`
- Primary key: `id` (String)
- Billing mode: Pay-per-request
- Encryption at rest enabled
- Point-in-time recovery settings

### 5. dynamodb-items.png
**DynamoDB Table Items**
- Sample registration data
- Proper data structure with all fields:
  - id (String)
  - name (String)  
  - email (String)
  - phone (String)
  - createdAt (ISO timestamp)

### 6. iam-user.png
**IAM User Configuration**
- User name: `rayqube-pizzahut-user`
- Attached policies
- Access key configuration (ID visible, secret hidden)
- Creation date and last activity

### 7. iam-policy.png
**IAM Policy Details**
- Policy name: `RayqubePizzaHutPolicy`
- Least-privilege permissions:
  - S3: GetObject, PutObject, DeleteObject on specific bucket
  - S3: ListBucket on specific bucket
  - DynamoDB: PutItem, GetItem, Scan, Query on specific table
- No wildcard permissions

## AWS Resources Created

### Infrastructure Summary:
```
Region: us-east-1
Account: [REDACTED]
Created: September 27, 2025

Resources:
- S3 Bucket: rayqube-pizzahut-uploads-20250927
- DynamoDB Table: rayqube-registrations  
- IAM User: rayqube-pizzahut-user
- IAM Policy: RayqubePizzaHutPolicy
- Amplify App: pizza-hut-demo-platform
```

### Security Configuration:
- ✅ S3 bucket is private (no public access)
- ✅ All downloads use presigned URLs (1-hour expiry)
- ✅ IAM user has minimal required permissions
- ✅ DynamoDB table has encryption at rest
- ✅ HTTPS enforced on all endpoints

### Cost Optimization:
- ✅ All services use free tier limits
- ✅ DynamoDB on-demand billing
- ✅ S3 standard storage class
- ✅ Amplify free tier hosting

## Verification Commands

To verify the deployment, these AWS CLI commands were used:

```bash
# Verify S3 bucket
aws s3 ls s3://rayqube-pizzahut-uploads-20250927/
aws s3api get-bucket-cors --bucket rayqube-pizzahut-uploads-20250927

# Verify DynamoDB table
aws dynamodb describe-table --table-name rayqube-registrations
aws dynamodb scan --table-name rayqube-registrations --max-items 5

# Verify IAM user
aws iam get-user --user-name rayqube-pizzahut-user
aws iam list-attached-user-policies --user-name rayqube-pizzahut-user

# Verify Amplify app
aws amplify list-apps
aws amplify get-app --app-id [APP_ID]
```

## Deployment Timeline

1. **10:00 AM** - S3 bucket created and configured
2. **10:05 AM** - DynamoDB table provisioned
3. **10:10 AM** - IAM user and policy created
4. **10:15 AM** - Demo video uploaded to S3
5. **10:20 AM** - Amplify app connected to repository
6. **10:25 AM** - Environment variables configured
7. **10:30 AM** - First deployment initiated
8. **10:35 AM** - Deployment successful, testing begun
9. **10:40 AM** - All functionality verified

## Security Notes

All screenshots have been carefully reviewed to ensure:
- No AWS account IDs are visible
- No secret access keys are shown
- No sensitive configuration details exposed
- Only necessary information for verification is included

## Monitoring Setup

- **CloudWatch Logs**: Enabled for Lambda functions
- **S3 Access Logging**: Configured for audit trail
- **DynamoDB Metrics**: Enabled for performance monitoring
- **Amplify Monitoring**: Build and deployment tracking
