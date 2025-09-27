# AWS Setup Script for Pizza Hut Demo Platform
# This script creates all necessary AWS resources

param(
    [string]$Region = "us-east-1"
)

$ErrorActionPreference = "Stop"

Write-Host "🍕 Setting up AWS resources for Pizza Hut Demo Platform..." -ForegroundColor Green

# Generate unique identifiers
$Timestamp = (Get-Date).ToString("yyyyMMddHHmmss")
$ShortId = $Timestamp.Substring($Timestamp.Length - 8)
$BucketName = "rayqube-pizzahut-uploads-$ShortId"
$TableName = "rayqube-registrations"
$UserName = "rayqube-pizzahut-user"
$PolicyName = "RayqubePizzaHutPolicy"

Write-Host "📦 Creating S3 bucket: $BucketName" -ForegroundColor Yellow

# Create S3 bucket
try {
    aws s3 mb "s3://$BucketName" --region $Region
    Write-Host "✅ S3 bucket created successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create S3 bucket: $_" -ForegroundColor Red
    exit 1
}

# Configure S3 bucket CORS
Write-Host "🔧 Configuring S3 CORS..." -ForegroundColor Yellow
$CorsConfig = @"
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": [],
      "MaxAgeSeconds": 3600
    }
  ]
}
"@

$CorsConfig | Out-File -FilePath "cors-config.json" -Encoding UTF8
aws s3api put-bucket-cors --bucket $BucketName --cors-configuration file://cors-config.json
Remove-Item "cors-config.json"

# Block public access (keep bucket private)
Write-Host "🔒 Configuring S3 bucket security..." -ForegroundColor Yellow
aws s3api put-public-access-block --bucket $BucketName --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# Create DynamoDB table
Write-Host "🗄️ Creating DynamoDB table: $TableName" -ForegroundColor Yellow
try {
    aws dynamodb create-table --table-name $TableName --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --billing-mode PAY_PER_REQUEST --region $Region
    Write-Host "✅ DynamoDB table created successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create DynamoDB table: $_" -ForegroundColor Red
    exit 1
}

# Wait for table to be active
Write-Host "⏳ Waiting for DynamoDB table to be active..." -ForegroundColor Yellow
aws dynamodb wait table-exists --table-name $TableName --region $Region

# Create IAM policy
Write-Host "👤 Creating IAM policy: $PolicyName" -ForegroundColor Yellow
$AccountId = (aws sts get-caller-identity --query Account --output text)
$PolicyDocument = @"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3BucketAccess",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::$BucketName/*"
    },
    {
      "Sid": "S3BucketList",
      "Effect": "Allow", 
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::$BucketName"
    },
    {
      "Sid": "DynamoDBAccess",
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Scan",
        "dynamodb:Query"
      ],
      "Resource": "arn:aws:dynamodb:$Region`:$AccountId`:table/$TableName"
    }
  ]
}
"@

$PolicyDocument | Out-File -FilePath "policy.json" -Encoding UTF8
$PolicyArn = aws iam create-policy --policy-name $PolicyName --policy-document file://policy.json --query 'Policy.Arn' --output text
Remove-Item "policy.json"

# Create IAM user
Write-Host "👤 Creating IAM user: $UserName" -ForegroundColor Yellow
aws iam create-user --user-name $UserName

# Attach policy to user
aws iam attach-user-policy --user-name $UserName --policy-arn $PolicyArn

# Create access key
Write-Host "🔑 Creating access key for user..." -ForegroundColor Yellow
$AccessKeyOutput = aws iam create-access-key --user-name $UserName --output json | ConvertFrom-Json
$AccessKeyId = $AccessKeyOutput.AccessKey.AccessKeyId
$SecretAccessKey = $AccessKeyOutput.AccessKey.SecretAccessKey

# Generate random report token
$ReportToken = -join ((1..32) | ForEach { [char]((48..57) + (65..90) + (97..122) | Get-Random) })

# Create placeholder video file (simple text file for demo)
Write-Host "🎥 Creating placeholder video..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "temp-ads" | Out-Null
$VideoContent = "This is a placeholder for the Pizza Hut demo video. In production, this would be a proper MP4 file with pizza content."
$VideoContent | Out-File -FilePath "temp-ads/ad.mp4" -Encoding UTF8

# Upload placeholder video to S3
Write-Host "📤 Uploading placeholder video to S3..." -ForegroundColor Yellow
aws s3 cp "temp-ads/ad.mp4" "s3://$BucketName/ads/ad.mp4"
aws s3 cp "public/licenses/video-license.txt" "s3://$BucketName/ads/video-license.txt"

# Cleanup temp files
Remove-Item -Recurse -Force "temp-ads"

Write-Host ""
Write-Host "✅ AWS setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Configuration for Amplify deployment:" -ForegroundColor Cyan
Write-Host "NODE_ENV=production"
Write-Host "AWS_REGION=$Region"
Write-Host "AWS_ACCESS_KEY_ID=$AccessKeyId"
Write-Host "AWS_SECRET_ACCESS_KEY=$SecretAccessKey"
Write-Host "S3_BUCKET=$BucketName"
Write-Host "DDB_TABLE=$TableName"
Write-Host "BRAND_NAME=Pizza Hut"
Write-Host "AD_S3_KEY=ads/ad.mp4"
Write-Host "REPORT_TOKEN=$ReportToken"
Write-Host ""
Write-Host "🔐 IMPORTANT: Save these credentials securely!" -ForegroundColor Red
Write-Host "⚠️  The secret access key will not be shown again." -ForegroundColor Yellow
Write-Host ""

# Save configuration to file for reference
$ConfigContent = @"
# AWS Configuration for Pizza Hut Demo Platform
# Generated: $(Get-Date)

NODE_ENV=production
AWS_REGION=$Region
AWS_ACCESS_KEY_ID=$AccessKeyId
AWS_SECRET_ACCESS_KEY=$SecretAccessKey
S3_BUCKET=$BucketName
DDB_TABLE=$TableName
BRAND_NAME=Pizza Hut
AD_S3_KEY=ads/ad.mp4
REPORT_TOKEN=$ReportToken

# AWS Resources Created:
# - S3 Bucket: $BucketName
# - DynamoDB Table: $TableName
# - IAM User: $UserName
# - IAM Policy: $PolicyName
"@

$ConfigContent | Out-File -FilePath "aws-config.env" -Encoding UTF8
Write-Host "📝 Configuration saved to aws-config.env" -ForegroundColor Green

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Set these environment variables in AWS Amplify"
Write-Host "2. Deploy your application"
Write-Host "3. Test all functionality"
