import { Node, IConstruct } from 'constructs'
import { RemoteBackend, TerraformStack, TerraformElement } from 'cdktf';

export const applyRemoteState = (stack: TerraformStack): void => {
  new RemoteBackend(stack, {
    hostname: "app.terraform.io",
    organization: "cdk-dev",

    workspaces: {
      name: "dropkick"
    }
  });
}

interface Tags {
  [key: string]: string
}

interface Taggable {
  tags: Tags
}

export const applyTags = (stack: TerraformStack, tags: Tags): void => {
  const visit = (construct: IConstruct) => {
    if (construct instanceof TerraformElement) {
      if ('tags' in construct) {
        const taggable = construct as Taggable
        taggable.tags = tags
      }
    }

    for (const child of Node.of(construct).children) {
      visit(child);
    }
  }

  visit(stack)
}