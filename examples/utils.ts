import { RemoteBackend, TerraformStack } from 'cdktf';

export const applyRemoteState = (stack: TerraformStack): void => {
  new RemoteBackend(stack, {
    hostname: "app.terraform.io",
    organization: "cdk-dev",

    workspaces: {
      name: "dropkick"
    }
  });
}