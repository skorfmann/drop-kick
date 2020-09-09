
import { Construct, } from "constructs";
import {  Resource } from 'cdktf';
import { ContainerRegistry, DataGoogleClientConfig, DataGoogleContainerRegistryRepository } from "@cdktf/provider-google";
import { IRepository } from '..';

export interface GoogleContainerRepositoryConfig {
  name: string;
}

export class GoogleContainerRepository extends Resource implements IRepository {
  public readonly resource: ContainerRegistry;
  public readonly data: DataGoogleClientConfig;
  public readonly url: string;
  public readonly authorizationPassword: string;
  public readonly authorizationUser: string;

  constructor(scope: Construct, name: string, config: GoogleContainerRepositoryConfig) {
    super(scope, name);

    this.data = new DataGoogleClientConfig(this, 'current')

    const location = 'EU'
    const project = this.data.project

    this.resource = new ContainerRegistry(this, 'ecr-repository', {
      project,
      location
    });

    const repository = new DataGoogleContainerRegistryRepository(this, 'image', {
      project,
      region: location,
      dependsOn: [this.resource]
    })

    this.authorizationPassword = this.data.accessToken
    this.authorizationUser = 'oauth2accesstoken'
    this.url = `${repository.repositoryUrl}/${config.name}`;
  }
}