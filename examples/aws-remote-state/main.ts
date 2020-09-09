import { Construct } from 'constructs';
import { App, RemoteBackend } from 'cdktf';
import * as path from 'path';
import { AwsStack } from '../../stacks';

class AwsStackRemoteState extends AwsStack {
  constructor(scope: Construct, constructName: string) {
    super(scope, constructName, {
      path: path.join(__dirname, '..', 'app')
    })

    new RemoteBackend(this, {
      hostname: "app.terraform.io",
      organization: "cdktf",

      workspaces: {
        name: "dropkick"
      }
    });
  }
}

const app = new App();
new AwsStackRemoteState(app, 'aws-demo-with-remote-state');
app.synth();