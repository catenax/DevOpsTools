.github/workflows/backstage.yml can:
  - build Backstage image and push to container registry in Catena-X tenant/subscription
  - create resources on DevOpsTools cluster for Backstage deployment (ingress controller set up with Terraform in catenax/tractusx) 

default values in app-config.yaml
add appconfig to values.yaml (Catena-X DevOpsTools Backstage values: chart/devopstools-values.yaml)
modified files in release:
  - packages/app/src/App.tsx: remove auth provider options from site other than github (commented)
  - packages/app/src/identityProviders.ts: remove auth providers from provider list other than github (commented)
