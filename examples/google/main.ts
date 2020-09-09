import { Construct } from 'constructs';
import { App, TerraformStack } from 'cdktf';
import { GoogleProvider } from '@cdktf/provider-google';
import { DockerAsset } from '../../lib';
import * as path from 'path';

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new GoogleProvider(this, 'default', {
      project: 'dropkick'
    })

    new DockerAsset(this, 'bar', {
      name: 'google-demo',
      path: path.join(__dirname, '..', 'app')
    })
  }
}

const app = new App();
new MyStack(app, 'google-demo');
app.synth();
