import { IConstruct, Node } from "constructs";
import { TerraformProvider } from 'cdktf';

type Providers = Record<'aws' | 'google', TerraformProvider[]>

export const findProviders = (scope: IConstruct): Providers => {
  const providers:Providers = {
    "aws": [],
    "google": []
  }

  const visit = (node: IConstruct) => {
    if (node instanceof TerraformProvider) {
      switch(node.terraformResourceType) {
        case 'aws': providers['aws'].push(node); break;
        case 'google': providers['google'].push(node);
      }
    }

    for (const child of Node.of(node).children) {
      visit(child);
    }
  }

  visit(scope)

  return providers
}
