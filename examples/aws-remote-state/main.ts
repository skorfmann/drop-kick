import { App } from 'cdktf';
import * as path from 'path';
import { AwsStack } from '../../stacks';
import { applyRemoteState } from '../utils';

const app = new App();

const stack = new AwsStack(app, 'aws-demo-with-remote-state', {
  path: path.join(__dirname, '..', 'app')
});

applyRemoteState(stack)

app.synth();