import { Construct } from 'constructs';
import { TerraformStack } from 'cdktf';
import { GoogleProvider } from '@cdktf/provider-google';
import { DockerAsset } from '../lib';
import { GoogleContainerService } from '../lib/google/container-service';
import { StackConfig } from './stack-config'

interface GoogleStackConfig extends StackConfig {
  project: string;
}

export class GoogleStack extends TerraformStack {
  constructor(scope: Construct, constructName: string, config: GoogleStackConfig) {
    super(scope, constructName);

    const { region, name, path, project } = config;

    new GoogleProvider(this, 'default', {
      region,
      project
    })

    const dockerAsset = new DockerAsset(this, 'google-docker-asset', {
      name: name || 'google-demo',
      path
    })

    new GoogleContainerService(this, 'service', {
      name: 'dropkick-test',
      dockerAsset
    })
  }
}