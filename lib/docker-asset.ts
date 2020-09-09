import { Construct, Node } from "constructs";
import { TerraformOutput, Resource, TerraformResource, TerraformDataSource } from 'cdktf';
import * as Null from "@cdktf/provider-null";
import * as hashdirectory from 'hashdirectory';
import { IPrincipal } from '.'
import { findProviders } from './utils'
import { AwsEcrRepository } from './aws/ecr-repository'
import { GoogleContainerRepository } from './google/registry'

export interface IImage {
  digest: string;
}

export interface IRepository {
  url: string;
  resource: TerraformResource;
  data: TerraformDataSource;
  authorizationPassword: string;
  authorizationUser: string;
}

export interface IDockerAsset {
  repository: IRepository;
  workingDirectory: string;
  grantPull(principal: IPrincipal): void;
}

export interface DockerAssetConfig {
  path: string;
  name: string;
}

export class DockerAsset extends Resource implements IDockerAsset {
  public readonly repository: IRepository;
  public readonly workingDirectory: string;
  public readonly buildAndPush: Null.Resource;

  constructor(scope: Construct, name: string, config: DockerAssetConfig) {
    super(scope, name);

    const providers = findProviders(Node.of(this).root)

    this.workingDirectory = config.path
    this.buildAndPush = new Null.Resource(this, 'buildAndPush', {
      triggers: {
        folderhash: hashdirectory.sync(this.workingDirectory),
        name: config.name
      }
    });

    const repoConfig = {
      name: config.name
    }

    if (providers['aws'].length > 0) {
      this.repository = new AwsEcrRepository(this, 'foo', repoConfig)
      this.buildAndPush.addOverride('depends_on', [this.repository.data.fqn])
    } else if (providers['google'].length > 0) {
      this.repository = new GoogleContainerRepository(this, 'foo', repoConfig)
      this.buildAndPush.addOverride('depends_on', [this.repository.resource.fqn])
    } else {
      throw new Error('Please add a supported provider')
    }

    this.dockerBuildCommand()
  }

  public grantPull(principal: IPrincipal): void {
    console.log({principal})
  }

  protected addOutput(): void {
    new TerraformOutput(this, 'docker-repository-url', {
      value: this.repository.url
    })
  }

  protected dockerBuildCommand(): void {
    const imageName = this.repository.url;

    const command = `
      docker login --username ${this.repository.authorizationUser} --password ${this.repository.authorizationPassword} ${imageName} &&
      cd ${this.workingDirectory} && docker build -t ${imageName} . &&
      docker push ${imageName}
    `;
    this.buildAndPush.addOverride('provisioner.local-exec.command', command);
  }
}
