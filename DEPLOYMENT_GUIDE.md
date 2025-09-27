# Pizza Hut Demo Platform - Deployment Guide

## 🚀 Complete AWS Deployment Instructions

### Prerequisites
- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Node.js 18+ installed locally

## Step 1: AWS Infrastructure Setup

### Option A: CloudFormation (Recommended)
```bash
# Deploy infrastructure using CloudFormation
aws cloudformation create-stack \
  --stack-name pizza-hut-demo-infrastructure \
  --template-body file://scripts/aws-infrastructure.json \
  --capabilities CAPABILITY_IAM \
  --parameters ParameterKey=ProjectName,ParameterValue=pizza-hut-demo \
               ParameterKey=Environment,ParameterValue=production
```

### Option B: Manual Setup
```bash
# 1. Create S3 Bucket
aws s3 mb s3://rayqube-pizzahut-uploads-$(date +%s) --region us-east-1

# 2. Create DynamoDB Table
aws dynamodb create-table \
  --table-name rayqube-registrations \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# 3. Create IAM User (see CloudFormation template for policy)
aws iam create-user --user-name rayqube-pizzahut-user
```

## Step 2: Upload Video Content

```bash
# Upload the demo video to S3
aws s3 cp public/licenses/pizza-video-demo.mp4 s3://your-bucket-name/ads/ad.mp4
aws s3 cp public/licenses/pizza-video-license.txt s3://your-bucket-name/ads/license.txt
```

## Step 3: AWS Amplify Deployment

### 1. Connect Repository
- Go to AWS Amplify Console
- Click "New app" → "Host web app"
- Connect your Git repository
- Select the main branch

### 2. Build Settings
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### 3. Environment Variables
Set these in Amplify Console:
```
NODE_ENV=production
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET=your_bucket_name
DDB_TABLE=rayqube-registrations
BRAND_NAME=Pizza Hut
AD_S3_KEY=ads/ad.mp4
REPORT_TOKEN=your_secure_random_token
UPLOAD_MAX_MB=5
```

## Step 4: Generate Access Keys

```bash
# Create access key for the IAM user
aws iam create-access-key --user-name rayqube-pizzahut-user
```

**⚠️ Important**: Store the access key and secret securely. Add them to Amplify environment variables.

## Step 5: Deploy and Verify

1. **Deploy**: Amplify will automatically build and deploy
2. **Test Registration**: Visit the landing page and register a user
3. **Test CSV Report**: Access `/report.csv?token=your_token`
4. **Test Upload**: Upload a PNG and verify QR code generation
5. **Test API**: Use Postman to test `/api/upload-direct`

## Security Checklist

- ✅ S3 bucket is private (no public access)
- ✅ IAM user has minimal required permissions
- ✅ All secrets stored in Amplify environment variables
- ✅ HTTPS enforced on all endpoints
- ✅ Input validation on all API endpoints
- ✅ File upload restrictions (PNG only, 5MB max)
- ✅ Presigned URLs expire in 15 minutes

## Monitoring and Maintenance

### CloudWatch Logs
- API Gateway logs: Monitor API usage and errors
- Lambda logs: Check function execution and errors
- S3 access logs: Track file upload/download activity

### Regular Maintenance
```bash
# Clean up old uploads (run monthly)
aws s3 rm s3://your-bucket/uploads/ --recursive --exclude="*" --include="*" --older-than="30 days"

# Rotate access keys (run quarterly)
aws iam create-access-key --user-name rayqube-pizzahut-user
# Update Amplify environment variables
aws iam delete-access-key --user-name rayqube-pizzahut-user --access-key-id OLD_KEY_ID
```

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check environment variables are set correctly
   - Verify Node.js version compatibility

2. **API Errors**
   - Check IAM permissions
   - Verify S3 bucket exists and is accessible
   - Check DynamoDB table configuration

3. **File Upload Issues**
   - Verify S3 CORS configuration
   - Check file size and type restrictions
   - Ensure presigned URL generation works

### Debug Commands
```bash
# Test S3 access
aws s3 ls s3://your-bucket-name/

# Check DynamoDB table
aws dynamodb describe-table --table-name rayqube-registrations

# Verify IAM user
aws iam get-user --user-name rayqube-pizzahut-user
```

## Cost Optimization

This deployment uses AWS free tier services:
- **S3**: 5GB free storage
- **DynamoDB**: 25GB free storage + 25 read/write units
- **Amplify**: 1000 build minutes + 15GB served per month
- **IAM**: Free service

Expected monthly cost: **$0** (within free tier limits)

## Scaling Considerations

For production scaling:
1. **S3**: Consider CloudFront CDN for global distribution
2. **DynamoDB**: Monitor read/write capacity and adjust as needed
3. **Amplify**: Upgrade plan for higher traffic volumes
4. **Monitoring**: Set up CloudWatch alarms for key metrics
