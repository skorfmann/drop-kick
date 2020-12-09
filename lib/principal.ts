export interface IPrincipal {
  grant(grantName: string, actions: string[], ...resources: string[]): void
}
