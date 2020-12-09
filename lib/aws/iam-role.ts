import { Resource } from "cdktf";
import { Construct } from "constructs";
import {  IamRole, IamPolicy, IamRolePolicyAttachment } from "@cdktf/provider-aws";
import { IPrincipal } from '../principal'

export class AwsIamRole extends Resource implements IPrincipal {
  public readonly resource: IamRole

  constructor(scope: Construct, name: string) {
    super(scope, name);

    this.resource = new IamRole(this, 'task-role', {
      name: `${name}ecsTaskRole`,
      assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Action: "sts:AssumeRole",
            Principal: {
              Service: "ecs-tasks.amazonaws.com"
            },
            Effect: "Allow",
            Sid: ""
          }
        ]
      })
    })
  }

  public grant(grantName: string, actions: string[], ...resources: string[]) {
    const policy = new IamPolicy(this, `${this.resource.name}-${grantName}`, {
      namePrefix: grantName,
      description: 'automatically generated by cdktf',
      policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                "Effect": "Allow",
                "Action": actions,
                "Resource": resources.length > 0 ? resources : ['*']
            }
        ]
      })
    })

    new IamRolePolicyAttachment(this, `${policy.name}-attachment`, {
      role: this.resource.name!,
      policyArn: policy.arn
    })
  }
}