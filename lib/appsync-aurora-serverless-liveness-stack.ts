// cdk stable
import * as cdk from 'aws-cdk-lib';
import { aws_logs as logs, aws_rds as rds, aws_s3 as s3, aws_s3_deployment as s3_deployment } from 'aws-cdk-lib';
// cdk alpha
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import { Construct } from 'constructs';

export class AppsyncAuroraServerlessLivenessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cluster = minimumCluster(this);
    graphqlApi(this, id, cluster);
    websiteBucket(this);
  }
}

/**
 * Liveness のための 最小構成の Aurora Serverless V1 Cluster の定義
 *   - VPC, Secret は自動生成されるため省略
 */
const minimumCluster = (scope: Construct): rds.ServerlessCluster => {
  return new rds.ServerlessCluster(scope, 'LivenessOnly', {
    engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
    defaultDatabaseName: 'liveness',
    enableDataApi: true,
    backupRetention: cdk.Duration.days(1),
    scaling: {
      autoPause: cdk.Duration.minutes(5),
      minCapacity: rds.AuroraCapacityUnit.ACU_1,
      maxCapacity: rds.AuroraCapacityUnit.ACU_1,
    },
    removalPolicy: cdk.RemovalPolicy.DESTROY,
  });
};

/**
 * Aurora Serverless をバックエンドに持つ AppSync GraphQL API の定義
 * @see https://docs.aws.amazon.com/cdk/api/v2/docs/aws-appsync-alpha-readme.html
 */
const GRAPHQL_ENDPOINTS: appsync.BaseResolverProps[] = [
  {
    typeName: 'Query',
    fieldName: 'liveness',
    requestMappingTemplate: appsync.MappingTemplate.fromFile('./lib/api/resolvers/liveness/request.vtl'),
    responseMappingTemplate: appsync.MappingTemplate.fromFile('./lib/api/resolvers/liveness/response.vtl'),
  },
];
const graphqlApi = (scope: Construct, id: string, cluster: rds.ServerlessCluster) => {
  /**
   * 不具合: 初回デプロイ時に AWSServiceRoleForAppSync の紐付けに失敗する
   * -> 再実行するとエラーが発生せずに実行できる
   * @see https://github.com/aws/aws-cdk/issues/16598
   */
  const api = new appsync.GraphqlApi(scope, `${id}Api`, {
    name: `${id}Api`,
    schema: appsync.Schema.fromAsset('./lib/api/schema.graphql'),
  });
  const dataSource = api.addRdsDataSource('RDSDataSource', cluster, cluster.secret!);
  GRAPHQL_ENDPOINTS.forEach((endpoint) => {
    dataSource.createResolver(endpoint);
  });
  return api;
};

const websiteBucket = (scope: Construct) => {
  // 静的サイト
  const websiteBucket = new s3.Bucket(scope, 'websiteBucket', {
    websiteIndexDocument: 'index.html',
    publicReadAccess: true,
    enforceSSL: true,
    autoDeleteObjects: true,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
  });
  new s3_deployment.BucketDeployment(scope, 'websiteBucketDeployment', {
    sources: [s3_deployment.Source.asset('./lib/web/build')],
    destinationBucket: websiteBucket,
    cacheControl: [s3_deployment.CacheControl.fromString('no-store')],
    logRetention: logs.RetentionDays.ONE_DAY,
  });
};
