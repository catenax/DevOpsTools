# Backstage

Sources:
- backstage.io helm deployment documentation: https://backstage.io/docs/deployment/helm
- artifacthub.io deliveryhero backstage: https://artifacthub.io/packages/helm/deliveryhero/backstage

###### 1. Configure the application in values.yaml

e.g.

```
appConfig:
  app:
    baseUrl: https://backstage.mydomain.com
    title: Backstage
  backend:
    baseUrl: https://backstage.mydomain.com
    cors:
      origin: https://backstage.mydomain.com
  lighthouse:
    baseUrl: https://backstage.mydomain.com/lighthouse-api
  techdocs:
    storageUrl: https://backstage.mydomain.com/api/techdocs/static/docs
    requestUrl: https://backstage.mydomain.com/api/techdocs
```

###### 2. Add Delivery Hero public chart repo:

`helm repo add deliveryhero https://charts.deliveryhero.io/`

###### 3. Install with custom values file:

`helm install my-release deliveryhero/backstage -f values.yaml`
