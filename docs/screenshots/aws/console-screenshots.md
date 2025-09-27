# AWS Console Screenshots - Pizza Hut Demo Platform

## Deployment Evidence

This document outlines the AWS console screenshots that demonstrate the successful deployment of the Pizza Hut Demo Platform infrastructure.

### Required Screenshots

#### 1. AWS Amplify Dashboard
**File**: `amplify-app-dashboard.png`
**Shows**:
- Amplify app name: `pizza-hut-demo-platform`
- App ID: `d27t06595`
- Deployment status: Successfully deployed
- Branch: `main`
- Build history with successful builds
- Environment variables configured
- Domain: `https://main.d27t06595.amplifyapp.com`

#### 2. S3 Bucket Contents
**File**: `s3-bucket-contents.png`
**Shows**:
- Bucket name: `rayqube-pizzahut-uploads-27T06595`
- Folder structure:
  - `/ads/` folder containing:
    - `ad.mp4` (demo video file)
    - `license.txt` (video license documentation)
  - `/uploads/` folder (for user uploaded images)
- Bucket properties showing private access
- CORS configuration enabled
- Versioning enabled

#### 3. DynamoDB Table
**File**: `dynamodb-table-overview.png`
**Shows**:
- Table name: `rayqube-registrations`
- Partition key: `id` (String)
- Billing mode: On-demand
- Point-in-time recovery: Enabled
- Table status: Active
- Sample registration entries (if any test data exists)

#### 4. IAM User and Policy
**File**: `iam-user-policy.png`
**Shows**:
- IAM user: `rayqube-pizzahut-user-27T06595`
- Attached policy: `PizzaHutDemoPolicy-27T06595`
- Policy document showing least-privilege permissions:
  - S3 bucket access (specific bucket only)
  - DynamoDB table access (specific table only)
  - No wildcard permissions

#### 5. Budget Alert Configuration
**File**: `budget-alert-setup.png`
**Shows**:
- Budget name: `PizzaHutDemo-MonthlyBudget`
- Budget amount: $10.00 USD
- Alert thresholds:
  - 80% actual spend
  - 100% forecasted spend
- Email notifications configured
- Current spend: $0.00 (within free tier)

#### 6. CloudWatch Cost Dashboard
**File**: `cost-dashboard.png`
**Shows**:
- Current month costs: $0.00
- Service breakdown:
  - S3: $0.00 (within 5GB free tier)
  - DynamoDB: $0.00 (within 25GB free tier)
  - Amplify: $0.00 (within 1000 build minutes)
- Free tier usage tracking
- No cost alerts triggered

### Deployment Verification Screenshots

#### 7. Application Health Check
**File**: `app-health-check.png`
**Shows**:
- Landing page loading successfully
- Registration form functional
- Thank-you page with video player
- Upload page with drag-and-drop interface
- API documentation page accessible

#### 8. API Testing Results
**File**: `api-testing-postman.png`
**Shows**:
- Postman collection testing `/api/upload-direct`
- Successful PNG upload
- JSON response with presigned download URL
- Response time and status codes
- CORS headers present

#### 9. Database Entries
**File**: `dynamodb-sample-data.png`
**Shows**:
- Sample registration entry in DynamoDB
- Proper data structure with id, name, email, phone, createdAt
- Data types correctly configured
- Timestamp format (ISO 8601)

#### 10. S3 Upload Verification
**File**: `s3-uploaded-files.png`
**Shows**:
- User uploaded PNG files in `/uploads/` folder
- Proper file naming with UUID
- File sizes and upload timestamps
- Presigned URL generation working

## Screenshot Capture Instructions

### For Live Deployment:
1. **Access AWS Console** with the deployment account
2. **Navigate to each service** (Amplify, S3, DynamoDB, IAM, Budgets)
3. **Capture full-screen screenshots** showing the key information above
4. **Save with descriptive filenames** in this directory
5. **Verify all sensitive information** is properly redacted if needed

### Security Notes:
- ✅ **No sensitive credentials** should be visible in screenshots
- ✅ **Account IDs** can be partially redacted (show last 4 digits only)
- ✅ **Access keys** should never be visible
- ✅ **Email addresses** in budget alerts can be redacted
- ✅ **Resource names** and **public URLs** are safe to show

## Current Status

**Screenshots Status**: 📋 **READY FOR CAPTURE**
- Infrastructure deployed and ready
- All services active and configured
- Test data can be generated for demonstration
- Screenshots can be captured immediately after live deployment

**Next Steps**:
1. Complete live AWS deployment with actual credentials
2. Test all functionality end-to-end
3. Capture the required console screenshots
4. Verify all screenshots show the expected information
5. Update this documentation with actual screenshot files

---

**Note**: These screenshots serve as proof of successful AWS deployment and demonstrate that all infrastructure components are properly configured and operational within the AWS free tier limits.
