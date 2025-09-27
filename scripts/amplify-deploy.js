#!/usr/bin/env node

/**
 * Pizza Hut Demo Platform - Amplify Deployment Script
 * This script automates the complete deployment to AWS Amplify
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  appName: 'pizza-hut-demo-platform',
  region: 'us-east-1',
  branch: 'main',
  buildSpec: {
    version: 1,
    frontend: {
      phases: {
        preBuild: {
          commands: [
            'npm ci'
          ]
        },
        build: {
          commands: [
            'npm run build'
          ]
        }
      },
      artifacts: {
        baseDirectory: '.next',
        files: ['**/*']
      },
      cache: {
        paths: [
          'node_modules/**/*',
          '.next/cache/**/*'
        ]
      }
    }
  },
  environmentVariables: {
    NODE_ENV: 'production',
    AWS_REGION: 'us-east-1',
    S3_BUCKET: 'rayqube-pizzahut-uploads-202509271430',
    DDB_TABLE: 'rayqube-registrations',
    BRAND_NAME: 'Pizza Hut',
    AD_S3_KEY: 'ads/ad.mp4',
    REPORT_TOKEN: 'ph_demo_2025_secure_token_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
    UPLOAD_MAX_MB: '5'
  }
};

console.log('🍕 Pizza Hut Demo Platform - Amplify Deployment');
console.log('================================================');

function runCommand(command, description) {
  console.log(`\n🔧 ${description}...`);
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    console.log(`✅ ${description} completed`);
    return output;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    throw error;
  }
}

async function deployToAmplify() {
  try {
    // Check AWS CLI configuration
    console.log('\n1. Checking AWS Configuration...');
    const identity = JSON.parse(runCommand('aws sts get-caller-identity', 'Getting AWS identity'));
    console.log(`✅ Connected to AWS Account: ${identity.Account}`);

    // Create Amplify app
    console.log('\n2. Creating Amplify Application...');
    const createAppCommand = `aws amplify create-app --name "${CONFIG.appName}" --repository "https://github.com/user/pizza-hut-demo" --platform WEB --region ${CONFIG.region}`;
    
    let appId;
    try {
      const createResult = JSON.parse(runCommand(createAppCommand, 'Creating Amplify app'));
      appId = createResult.app.appId;
      console.log(`✅ Amplify app created with ID: ${appId}`);
    } catch (error) {
      // App might already exist
      console.log('⚠️ App might already exist, trying to list apps...');
      const listApps = JSON.parse(runCommand(`aws amplify list-apps --region ${CONFIG.region}`, 'Listing existing apps'));
      const existingApp = listApps.apps.find(app => app.name === CONFIG.appName);
      if (existingApp) {
        appId = existingApp.appId;
        console.log(`✅ Using existing app ID: ${appId}`);
      } else {
        throw error;
      }
    }

    // Set environment variables
    console.log('\n3. Setting Environment Variables...');
    for (const [key, value] of Object.entries(CONFIG.environmentVariables)) {
      const envCommand = `aws amplify put-app --app-id ${appId} --environment-variables ${key}="${value}" --region ${CONFIG.region}`;
      try {
        runCommand(envCommand, `Setting ${key}`);
      } catch (error) {
        console.log(`⚠️ Failed to set ${key}, continuing...`);
      }
    }

    // Create branch
    console.log('\n4. Creating Branch...');
    const createBranchCommand = `aws amplify create-branch --app-id ${appId} --branch-name ${CONFIG.branch} --region ${CONFIG.region}`;
    try {
      runCommand(createBranchCommand, 'Creating main branch');
    } catch (error) {
      console.log('⚠️ Branch might already exist, continuing...');
    }

    // Start deployment
    console.log('\n5. Starting Deployment...');
    const deployCommand = `aws amplify start-job --app-id ${appId} --branch-name ${CONFIG.branch} --job-type RELEASE --region ${CONFIG.region}`;
    const deployResult = JSON.parse(runCommand(deployCommand, 'Starting deployment'));
    const jobId = deployResult.jobSummary.jobId;

    console.log(`✅ Deployment started with Job ID: ${jobId}`);
    console.log('\n6. Deployment Status...');
    console.log('🔄 Deployment is in progress. This may take 5-10 minutes.');
    
    // Generate URLs
    const appUrl = `https://${CONFIG.branch}.${appId}.amplifyapp.com`;
    
    console.log('\n🎉 DEPLOYMENT INFORMATION');
    console.log('========================');
    console.log(`App ID: ${appId}`);
    console.log(`App URL: ${appUrl}`);
    console.log(`Region: ${CONFIG.region}`);
    console.log(`Branch: ${CONFIG.branch}`);
    
    console.log('\n📋 PUBLIC URLS (Available after deployment completes):');
    console.log(`Landing Page: ${appUrl}/`);
    console.log(`Upload Page: ${appUrl}/upload`);
    console.log(`API Docs: ${appUrl}/api-docs`);
    console.log(`CSV Report: ${appUrl}/report.csv?token=${CONFIG.environmentVariables.REPORT_TOKEN}`);
    console.log(`API Base: ${appUrl}/api`);

    // Save deployment info
    const deploymentInfo = {
      appId,
      appUrl,
      region: CONFIG.region,
      branch: CONFIG.branch,
      deploymentTime: new Date().toISOString(),
      environmentVariables: CONFIG.environmentVariables
    };

    fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
    console.log('\n✅ Deployment information saved to deployment-info.json');

    return deploymentInfo;

  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Run deployment
if (require.main === module) {
  deployToAmplify();
}

module.exports = { deployToAmplify, CONFIG };
