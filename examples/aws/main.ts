
import { App } from 'cdktf';
import * as path from 'path';
import { AwsStack } from '../../stacks'

const app = new App();

new AwsStack(app, 'aws-demo', {
  path: path.join(__dirname, '..', 'app')
});

app.synth();