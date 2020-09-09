import { Construct } from 'constructs';
import { App, TerraformStack } from 'cdktf';
import { AwsProvider } from '@cdktf/provider-aws';
import { DockerAsset } from '../../lib';
import * as path from 'path';

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new AwsProvider(this, 'default', {
      region: 'eu-central-1'
    })

    new DockerAsset(this, 'bar', {
      name: 'aws-demo',
      path: path.join(__dirname, '..', 'app')
    })
  }
}

const app = new App();
new MyStack(app, 'aws-demo');
app.synth();

