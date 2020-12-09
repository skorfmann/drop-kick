import { Construct } from 'constructs';
import { TerraformStack } from 'cdktf';
import { AwsProvider, EcsCluster } from '@cdktf/provider-aws';
import { DockerAsset } from '../lib';
import { AwsVpc, AwsRegions, AwsEcsFargateService } from '../lib/aws';
import { StackConfig } from './stack-config'

export class AwsStack extends TerraformStack {
  constructor(scope: Construct, constructName: string, config: StackConfig) {
    super(scope, constructName);

    const { region = AwsRegions.frankfurt.code, name, path } = config;

    new AwsProvider(this, 'default', {
      region: region || 'eu-central-1'
    })

    const dockerAsset = new DockerAsset(this, 'aws', {
      name: name || 'dropkick',
      path
    })

    const vpc = new AwsVpc(this, 'vpc', {
      cidrBlock: '10.100.0.0/16',
      region: AwsRegions.frankfurt
    })

    new AwsEcsFargateService(this, 'fargate', {
      region: AwsRegions.frankfurt,
      dockerAsset,
      serviceName: 'demo',
      vpc,
      cluster: new EcsCluster(this, 'demo-cluster', {name: 'demo'})
    })
  }
}