#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AppsyncAuroraServerlessLivenessStack } from '../lib/appsync-aurora-serverless-liveness-stack';

const app = new cdk.App();
new AppsyncAuroraServerlessLivenessStack(app, 'AppsyncAuroraServerlessLivenessStack', {});
