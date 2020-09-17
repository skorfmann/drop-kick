import { Construct, Node } from "constructs";
import { TerraformOutput, Resource, TerraformResource, TerraformDataSource } from 'cdktf';
import * as Null from "@cdktf/provider-null";
import * as hashdirectory from 'hashdirectory';
import { IPrincipal } from '.'
import { findProviders } from './utils'
import { AwsEcrRepository } from './aws/ecr-repository'
import { GoogleContainerRepository } from './google/registry'
import { DockerImage } from './docker/image'

export interface IImage {
  digest: string;
}

export interface IRepository {
  url: string;
  resource: TerraformResource;
  dependable: TerraformDataSource | TerraformResource;
  authorizationPassword: string;
  authorizationUser: string;
}

export interface IDockerAsset {
  repository: IRepository;
  workingDirectory: string;
  dockerImage: DockerImage;
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
  public readonly dockerImage: DockerImage;

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
    } else if (providers['google'].length > 0) {
      this.repository = new GoogleContainerRepository(this, 'foo', repoConfig)
    } else {
      throw new Error('Please add a supported provider')
    }

    this.buildAndPush.addOverride('depends_on', [this.repository.dependable.fqn])
    this.dockerBuildCommand()

    this.dockerImage = new DockerImage(this, 'image', {
      repository: this.repository,
      dependsOn: [this.buildAndPush]
    })
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
