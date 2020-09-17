import { Construct, } from "constructs";
import {  Resource, TerraformOutput } from 'cdktf';
import { CloudRunService, CloudRunServiceIamPolicy, DataGoogleIamPolicy } from "@cdktf/provider-google";
import { IDockerAsset } from '..';

export interface GoogleContainerServiceConfig {
  name: string;
  dockerAsset: IDockerAsset;
}

export class GoogleContainerService extends Resource {
  constructor(scope: Construct, name: string, config: GoogleContainerServiceConfig) {
    super(scope, name);

    const service = new CloudRunService(this, 'service', {
      name: config.name,
      location: 'europe-west4',
      template: [{
        spec: [{
          containers: [{
            image: config.dockerAsset.dockerImage.url,
            ports: [{
              containerPort: 80
            }],
            resources: [{
              limits: {
                cpu: "1000m",
                memory: "256Mi"
              }
            }]
          }]
        }]
      }]
    })

    const policy = new DataGoogleIamPolicy(this, 'publicAccessPolicy', {
      binding: [{
        role: 'roles/run.invoker',
        members: ['allUsers']
      }]
    })

    new CloudRunServiceIamPolicy(this, 'public', {
      location: service.location,
      service: service.name,
      policyData: policy.policyData,
      dependsOn: [service]
    })

    new TerraformOutput(this, 'service-url', {
      value: service.status('0').url
    })
  }
}