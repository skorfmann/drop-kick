import { Construct } from 'constructs';
import { TerraformStack } from 'cdktf';
import { AwsProvider } from '@cdktf/provider-aws';
import { DockerAsset } from '../lib';
import { StackConfig } from './stack-config'

export class AwsStack extends TerraformStack {
  constructor(scope: Construct, constructName: string, config: StackConfig) {
    super(scope, constructName);

    const { region, name, path } = config;

    new AwsProvider(this, 'default', {
      region: region || 'eu-central-1'
    })

    new DockerAsset(this, 'aws', {
      name: name || 'dropkick',
      path
    })
  }
}