import { App } from 'cdktf';
import { GoogleStack } from '../../stacks';
import * as path from 'path';

const app = new App();

new GoogleStack(app, 'google-demo', {
  path: path.join(__dirname, '..', 'app'),
  project: process.env.GOOGLE_PROJECT || 'dropkick'
});

app.synth();
