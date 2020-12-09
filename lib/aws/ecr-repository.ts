import { Construct, } from "constructs";
import {  Resource } from 'cdktf';
import { EcrRepository, DataAwsEcrAuthorizationToken } from "@cdktf/provider-aws";
import { IRepository } from '..';
import { IPrincipal } from '../principal'

export interface AwsEcrRepositoryConfig {
  name: string;
}

export class AwsEcrRepository extends Resource implements IRepository {
  public readonly resource: EcrRepository;
  public readonly dependable: DataAwsEcrAuthorizationToken;
  public readonly url: string;
  public readonly authorizationPassword: string;
  public readonly authorizationUser: string;

  constructor(scope: Construct, name: string, config: AwsEcrRepositoryConfig) {
    super(scope, name);

    this.resource = new EcrRepository(this, 'ecr-repository', {
      name: config.name,
    });

    const data = new DataAwsEcrAuthorizationToken(this, 'ecr-repository-token', {
      dependsOn: [this.resource]
    })

    this.authorizationPassword = data.password
    this.authorizationUser = data.userName
    this.url = this.resource.repositoryUrl;
    this.dependable = data
  }

  public grantPull(principal: IPrincipal) {
    const actions = [
      'ecr:BatchCheckLayerAvailability',
      'ecr:GetDownloadUrlForLayer',
      'ecr:BatchGetImage'
    ]
    principal.grant('ecr-pull', actions, this.resource.arn)
    principal.grant('ecr-login', ['ecr:GetAuthorizationToken'])
  }

}