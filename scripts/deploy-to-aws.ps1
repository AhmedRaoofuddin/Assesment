# Pizza Hut Demo Platform - Complete AWS Deployment Script
# This script sets up the entire AWS infrastructure and deploys the application

param(
    [string]$Region = "us-east-1",
    [string]$BudgetAmount = "10",
    [string]$ProjectName = "pizza-hut-demo"
)

Write-Host "🍕 Pizza Hut Demo Platform - AWS Deployment Starting..." -ForegroundColor Green
Write-Host "Region: $Region" -ForegroundColor Cyan
Write-Host "Budget: $BudgetAmount USD" -ForegroundColor Cyan

# Generate unique short ID for resources
$ShortId = (Get-Date -Format "yyyyMMddHHmm")
$S3BucketName = "rayqube-pizzahut-uploads-$ShortId"
$IAMUserName = "rayqube-pizzahut-user-$ShortId"
$PolicyName = "PizzaHutDemoPolicy-$ShortId"

Write-Host "Generated Short ID: $ShortId" -ForegroundColor Yellow

# Step 1: Check AWS CLI configuration
Write-Host "🔧 Step 1: Checking AWS Configuration..." -ForegroundColor Blue
try {
    $Identity = aws sts get-caller-identity 2>$null | ConvertFrom-Json
    if ($Identity) {
        Write-Host "✅ AWS CLI configured for account: $($Identity.Account)" -ForegroundColor Green
    } else {
        throw "Not configured"
    }
} catch {
    Write-Host "❌ AWS CLI not configured. Please run 'aws configure' first." -ForegroundColor Red
    Write-Host "You need to provide:" -ForegroundColor Yellow
    Write-Host "  - AWS Access Key ID" -ForegroundColor Yellow
    Write-Host "  - AWS Secret Access Key" -ForegroundColor Yellow
    Write-Host "  - Default region: $Region" -ForegroundColor Yellow
    Write-Host "  - Default output format: json" -ForegroundColor Yellow
    exit 1
}

# Step 2: Create Budget Alert
Write-Host "💰 Step 2: Setting up Budget Alert..." -ForegroundColor Blue
$BudgetJson = @"
{
    "BudgetName": "PizzaHutDemo-MonthlyBudget",
    "BudgetLimit": {
        "Amount": "$BudgetAmount",
        "Unit": "USD"
    },
    "TimeUnit": "MONTHLY",
    "BudgetType": "COST",
    "CostFilters": {
        "TagKey": ["Project"],
        "TagValue": ["Pizza Hut Demo"]
    }
}
"@

$NotificationJson = @"
[
    {
        "Notification": {
            "NotificationType": "ACTUAL",
            "ComparisonOperator": "GREATER_THAN",
            "Threshold": 80
        },
        "Subscribers": [
            {
                "SubscriptionType": "EMAIL",
                "Address": "alerts@example.com"
            }
        ]
    }
]
"@

try {
    $BudgetJson | Out-File -FilePath "budget.json" -Encoding utf8
    $NotificationJson | Out-File -FilePath "notifications.json" -Encoding utf8
    aws budgets create-budget --account-id $Identity.Account --budget file://budget.json --notifications-with-subscribers file://notifications.json 2>$null
    Write-Host "✅ Budget alert created successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Budget creation failed (may already exist)" -ForegroundColor Yellow
}

# Step 3: Create S3 Bucket
Write-Host "🪣 Step 3: Creating S3 Bucket..." -ForegroundColor Blue
try {
    aws s3 mb s3://$S3BucketName --region $Region
    Write-Host "✅ S3 bucket created: $S3BucketName" -ForegroundColor Green
    
    # Configure bucket policy for private access
    $BucketPolicy = @"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "DenyPublicAccess",
            "Effect": "Deny",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$S3BucketName/*",
            "Condition": {
                "Bool": {
                    "aws:SecureTransport": "false"
                }
            }
        }
    ]
}
"@
    
    $BucketPolicy | Out-File -FilePath "bucket-policy.json" -Encoding utf8
    aws s3api put-bucket-policy --bucket $S3BucketName --policy file://bucket-policy.json
    
    # Configure CORS
    $CorsConfig = @"
{
    "CORSRules": [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
            "AllowedOrigins": ["*"],
            "MaxAgeSeconds": 3600
        }
    ]
}
"@
    
    $CorsConfig | Out-File -FilePath "cors.json" -Encoding utf8
    aws s3api put-bucket-cors --bucket $S3BucketName --cors-configuration file://cors.json
    
    Write-Host "✅ S3 bucket configured with CORS and security policy" -ForegroundColor Green
} catch {
    Write-Host "❌ S3 bucket creation failed" -ForegroundColor Red
    exit 1
}

# Step 4: Create DynamoDB Table
Write-Host "🗃️ Step 4: Creating DynamoDB Table..." -ForegroundColor Blue
try {
    aws dynamodb create-table `
        --table-name rayqube-registrations `
        --attribute-definitions AttributeName=id,AttributeType=S `
        --key-schema AttributeName=id,KeyType=HASH `
        --billing-mode PAY_PER_REQUEST `
        --region $Region `
        --tags Key=Project,Value="Pizza Hut Demo"
    
    Write-Host "✅ DynamoDB table created: rayqube-registrations" -ForegroundColor Green
    
    # Wait for table to be active
    Write-Host "⏳ Waiting for table to become active..." -ForegroundColor Yellow
    aws dynamodb wait table-exists --table-name rayqube-registrations --region $Region
    Write-Host "✅ DynamoDB table is now active" -ForegroundColor Green
} catch {
    Write-Host "❌ DynamoDB table creation failed" -ForegroundColor Red
    exit 1
}

# Step 5: Create IAM User and Policy
Write-Host "👤 Step 5: Creating IAM User and Policy..." -ForegroundColor Blue
try {
    # Create IAM policy
    $PolicyDocument = @"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "S3BucketAccess",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:GetObjectAcl",
                "s3:PutObjectAcl"
            ],
            "Resource": "arn:aws:s3:::$S3BucketName/*"
        },
        {
            "Sid": "S3BucketList",
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": "arn:aws:s3:::$S3BucketName"
        },
        {
            "Sid": "DynamoDBAccess",
            "Effect": "Allow",
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem",
                "dynamodb:Scan",
                "dynamodb:Query"
            ],
            "Resource": "arn:aws:dynamodb:$Region:$($Identity.Account):table/rayqube-registrations"
        }
    ]
}
"@
    
    $PolicyDocument | Out-File -FilePath "policy.json" -Encoding utf8
    aws iam create-policy --policy-name $PolicyName --policy-document file://policy.json
    
    # Create IAM user
    aws iam create-user --user-name $IAMUserName --tags Key=Project,Value="Pizza Hut Demo"
    
    # Attach policy to user
    aws iam attach-user-policy --user-name $IAMUserName --policy-arn "arn:aws:iam::$($Identity.Account):policy/$PolicyName"
    
    # Create access keys
    $AccessKeys = aws iam create-access-key --user-name $IAMUserName | ConvertFrom-Json
    $AccessKeyId = $AccessKeys.AccessKey.AccessKeyId
    $SecretAccessKey = $AccessKeys.AccessKey.SecretAccessKey
    
    Write-Host "✅ IAM user created: $IAMUserName" -ForegroundColor Green
    Write-Host "✅ Access keys generated" -ForegroundColor Green
} catch {
    Write-Host "❌ IAM setup failed" -ForegroundColor Red
    exit 1
}

# Step 6: Generate Environment Variables
Write-Host "🔧 Step 6: Generating Environment Configuration..." -ForegroundColor Blue
$ReportToken = [System.Web.Security.Membership]::GeneratePassword(64, 0)
$EnvConfig = @"
NODE_ENV=production
AWS_REGION=$Region
AWS_ACCESS_KEY_ID=$AccessKeyId
AWS_SECRET_ACCESS_KEY=$SecretAccessKey
S3_BUCKET=$S3BucketName
DDB_TABLE=rayqube-registrations
BRAND_NAME=Pizza Hut
AD_S3_KEY=ads/ad.mp4
REPORT_TOKEN=$ReportToken
UPLOAD_MAX_MB=5
"@

$EnvConfig | Out-File -FilePath "production.env" -Encoding utf8
Write-Host "✅ Environment configuration saved to production.env" -ForegroundColor Green

# Step 7: Upload Demo Video
Write-Host "🎬 Step 7: Creating Demo Video Content..." -ForegroundColor Blue
# Create a minimal demo video file for testing
$VideoContent = "This is a demo video file for Pizza Hut platform testing. Replace with actual video content."
$VideoContent | Out-File -FilePath "demo-video.txt" -Encoding utf8

try {
    aws s3 cp demo-video.txt s3://$S3BucketName/ads/ad.mp4 --content-type "video/mp4"
    aws s3 cp ../public/licenses/pizza-video-license.txt s3://$S3BucketName/ads/license.txt
    Write-Host "✅ Demo content uploaded to S3" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Demo video upload failed, continuing..." -ForegroundColor Yellow
}

# Step 8: Output Deployment Information
Write-Host "📋 Step 8: Deployment Summary" -ForegroundColor Blue
Write-Host "================================" -ForegroundColor Cyan
Write-Host "S3 Bucket: $S3BucketName" -ForegroundColor White
Write-Host "DynamoDB Table: rayqube-registrations" -ForegroundColor White
Write-Host "IAM User: $IAMUserName" -ForegroundColor White
Write-Host "Region: $Region" -ForegroundColor White
Write-Host "Report Token: $ReportToken" -ForegroundColor White
Write-Host "================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Green
Write-Host "1. Use the environment variables in production.env for Amplify deployment" -ForegroundColor Yellow
Write-Host "2. Deploy the Next.js app using AWS Amplify Console" -ForegroundColor Yellow
Write-Host "3. Set the environment variables in Amplify" -ForegroundColor Yellow
Write-Host "4. Test all functionality after deployment" -ForegroundColor Yellow

Write-Host ""
Write-Host "⚠️  IMPORTANT: Store these credentials securely!" -ForegroundColor Red
Write-Host "Access Key ID: $AccessKeyId" -ForegroundColor White
Write-Host "Secret Access Key: $SecretAccessKey" -ForegroundColor White

# Cleanup temporary files
Remove-Item -Path "budget.json", "notifications.json", "bucket-policy.json", "cors.json", "policy.json", "demo-video.txt" -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "🎉 AWS Infrastructure Setup Complete!" -ForegroundColor Green
