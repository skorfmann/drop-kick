# Drop Kick

Take a folder with a Dockerfile and shoot it in the cloud with a drop kick :)

![drop kick](./drop-kick.png)

This leverages the [Terraform CDK](https://cdk.tf) to provide an abstraction over docker registries and serverless Container runtimes of public Cloud providers. Currently it supports AWS and Google Cloud.


## Prerequisites

- Terraform >= 0.12
- Node >= 10.12
- Docker
- An AWS or Google Cloud Account

### Credentials AWS

If you're using AWS, please make sure that valid credentials are set in your ENV

### Credentials Google Cloud

In case of Google Cloud, the example expects a valid login, e.g. `gcloud auth application-default login`

## Quickstart

```
npx drop-kick --target aws ./folder
```

## Development

### AWS Example

```
 yarn examples:aws:deploy
```

### Google Example

```
 yarn examples:google:deploy
```