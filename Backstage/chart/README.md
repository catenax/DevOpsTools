TODO: update values.yaml based on the following varaiables

###########################################
### Frontend - frontend-deployment.yaml
###########################################

- if .Values.frontend.enabled
include "backstage.fullname" .
.Values.frontend.replicaCount
- if .Values.dockerRegistrySecretName
.Values.dockerRegistrySecretName
.Chart.Name
.Values.frontend.image.repository
.Values.frontend.image.tag
.Values.frontend.image.pullPolicy
.Values.frontend.containerPort
- toYaml .Values.frontend.resources
include "backstage.fullname" .
include "backstage.appConfigFilename" .
include "backstage.appConfigFilename" .
include "backstage.fullname" .
- if .Values.global.nodeSelector
- toYaml .Values.global.nodeSelector
include "frontend.serviceName" .
.Values.frontend.containerPort
.Values.frontend.serviceType

###########################################
### Backend - backend-deployment.yaml
###########################################

include "backstage.fullname" .
.Values.backend.replicaCount
- if .Values.dockerRegistrySecretName
.Values.dockerRegistrySecretName
.Chart.Name
include "backstage.appConfigFilename" .
.Values.backend.image.repository
.Values.backend.image.tag
.Values.backend.image.pullPolicy
.Values.backend.containerPort
- toYaml .Values.backend.resources
.Values.backend.nodeEnv
include "backend.postgresql.passwordSecret" .
- if .Values.backend.postgresCertMountEnabled
include "backstage.backend.postgresCaDir" .
include "backstage.appConfigFilename" .
include "backstage.appConfigFilename" .
- if .Values.backend.postgresCertMountEnabled
include "backstage.fullname" .
include "backstage.fullname" .
- if .Values.global.nodeSelector
- toYaml .Values.global.nodeSelector
- if .Values.backend.enabled
include "backend.serviceName" .
.Values.backend.containerPort
.Values.backend.serviceType

#secret (backstage-backend) - backend-secret.yaml

- if .Values.backend.enabled
include "backstage.fullname" .
.Values.auth.google.clientSecret
.Values.auth.github.clientSecret
.Values.auth.gitlab.clientSecret
.Values.auth.okta.clientSecret
.Values.auth.oauth2.clientSecret
.Values.auth.auth0.clientSecret
.Values.auth.microsoft.clientSecret
.Values.auth.sentryToken
.Values.auth.rollbarAccountToken
.Values.auth.circleciAuthToken
.Values.auth.githubToken
.Values.auth.gitlabToken
.Values.auth.azure.api.token
.Values.auth.newRelicRestApiKey
.Values.auth.travisciAuthToken
.Values.auth.pagerdutyToken

# configmap (backstage-app-config) - backstage-app-config.yaml

include "backstage.fullname" .
include "backstage.appConfigFilename" .
tpl (.Files.Get "files/app-config.development.yaml.tpl") .
include "backstage.fullname" .
.Values.appConfig.app.baseUrl
.Values.appConfig.app.title
.Values.appConfig.app.googleAnalyticsTrackingId
.Values.appConfig.backend.baseUrl
.Values.appConfig.backend.cors.origin
.Values.appConfig.techdocs.storageUrl
.Values.appConfig.techdocs.requestUrl
.Values.appConfig.lighthouse.baseUrl
.Values.appConfig.auth.providers.github.development.appOrigin
.Values.appConfig.auth.providers.google.development.appOrigin
.Values.appConfig.auth.providers.gitlab.development.appOrigin
.Values.appConfig.auth.providers.okta.development.appOrigin
.Values.appConfig.auth.providers.oauth2.development.appOrigin

# configmap (backstage-auth) - backstage-auth-config.yaml

include "backstage.fullname" .
.Values.auth.google.clientId
.Values.auth.github.clientId
.Values.auth.gitlab.clientId
.Values.auth.gitlab.baseUrl
.Values.auth.okta.clientId
.Values.auth.okta.audience
.Values.auth.oauth2.clientId
.Values.auth.oauth2.authUrl
.Values.auth.oauth2.tokenUrl
.Values.auth.auth0.clientId
.Values.auth.auth0.domain
.Values.auth.microsoft.clientId
.Values.auth.microsoft.tenantId

###########################################
# ingress (backstage-ingress) - ingress.yaml
###########################################

- $frontendUrl := urlParse .Values.appConfig.app.baseUrl		#<- frontend
- $backendUrl := urlParse .Values.appConfig.backend.baseUrl
- $lighthouseUrl := urlParse .Values.appConfig.lighthouse.baseUrl
include "backstage.fullname" .
- if .Values.issuer.email
.Values.issuer.clusterIssuer
- toYaml .Values.ingress.annotations
include "backstage.fullname" .
include "frontend.serviceName" .
- if eq $frontendUrl.host $backendUrl.host
include "backend.serviceName" .
- else -
$backendUrl.host
$backendUrl.path | default "/"
include "backend.serviceName" .
- if not ( eq $frontendUrl.host $lighthouseUrl.host )
$lighthouseUrl.host
$lighthouseUrl.path | default "/"
include "lighthouse.serviceName" .
- else
include "backstage.fullname" .
- if .Values.issuer.email
.Values.issuer.clusterIssuer
- toYaml .Values.ingress.annotations
include "backstage.fullname" .
$lighthouseUrl.host
$frontendUrl.host
$lighthouseUrl.path
include "lighthouse.serviceName" .

# issuer - update cert-manager version and solver(s)

.Values.issuer.clusterIssuer
required "expected a valid .Values.issuer.email to enable ClusterIssuer" .Values.issuer.email
required "expected .Values.issuer.cluster-issuer to not be empty (letsencrypt-prod | letsencrypt-staging)" .Values.issuer.clusterIssuer

###########################################
### Lighthouse
###########################################

- if .Values.lighthouse.enabled
include "backstage.fullname" .
.Values.lighthouse.replicaCount
- if .Values.dockerRegistrySecretName
.Values.dockerRegistrySecretName
.Values.lighthouse.image.repository
.Values.lighthouse.image.tag
.Values.lighthouse.image.pullPolicy
.Values.lighthouse.containerPort
- toYaml .Values.lighthouse.resources
include "backstage.fullname" . -
include "backstage.fullname" .
.Values.lighthouse.containerPort
include "lighthouse.postgresql.passwordSecret" .
- if .Values.lighthouse.postgresCertMountEnabled
include "backstage.lighthouse.postgresCaDir" .
- if .Values.lighthouse.postgresCertMountEnabled
include "backstage.fullname" .
- if .Values.global.nodeSelector
- toYaml .Values.global.nodeSelector
include "lighthouse.serviceName" .
.Values.lighthouse.containerPort
.Values.lighthouse.serviceType

# configmap (backstage-lighthouse) - lighthouse-config.yaml

- if .Values.lighthouse.enabled
include "backstage.fullname" . -
.Values.lighthouse.database.connection.database
include "lighthouse.postgresql.user" .
include "lighthouse.postgresql.port" .
include "lighthouse.postgresql.host" .
include "backstage.lighthouse.postgresCaFilename" .

###########################################
### Postgresql
###########################################

# configmap (backstage-postgres-ca) - postgresql-ca-config.yaml

- if .Values.postgresql.enabled
include "backstage.fullname" .
include "backstage.postgresql.fullname" .
.Release.Name
.Values.global.postgresql.caFilename
include "backstage.postgresql.generateCA" .
include "backstage.fullname" .
.Release.Namespace $caConfig

# secret () - postgresql-certs-secret.yaml

- if .Values.postgresql.enabled
.Values.postgresql.tls.certificatesSecret
include "backstage.postgresql.fullname" .
.Release.Name
include "generateCerts" .

# secret () - postgresql-initdb-secret.yaml

- if .Values.postgresql.enabled
.Values.postgresql.initdbScriptsSecret
.Files.Get "files/create-backend-dbs.sql"

# secret () - postgresql-password-backend-secret.yaml

- if not .Values.postgresql.enabled
include "backend.postgresql.passwordSecret" .
.Release.Name
.Values.appConfig.backend.database.connection.password

# secret () - postgresql-password-lighthouse-secret.yaml

- if .Values.lighthouse.enabled
- if not .Values.postgresql.enabled
include "lighthouse.postgresql.passwordSecret" .
.Release.Name
.Values.lighthouse.database.connection.password

and app-config part based on these custom values (check latest settings):
```
app:
  title: Backstage - Catena-X
  baseUrl: http://backstage.47fc360e217349b384cd.germanywestc

  support:
    url: https://github.com/catenax/DevOpsTools/issues
	items:
	    links:
		  - url: https://github.com/catenax/DevOpsTools/issue

backend:
  auth:
    keys:
	  - secret: ${BACKEND_SECRET}
  baseUrl: http://backstage.47fc360e217349b384cd.germanywestc
  database:
    client: pg
	connection:
	  host: ${PG_HOST}
	  port: ${PG_PORT}
	  user: ${PG_USER}
	  password: ${PG_PASS}
	  database: ${PG_DB}
  cors:
    origin: http://backstage.47fc360e217349b384cd.germanywest

lighthouse:
  baseUrl: http://cxtsidevopstoolsakssrv.germanywestcentral.c

auth:
  providers: #(other providers commented)
    github:
	  development:
	    appOrigin: http://backstage.47fc360e217349b384cd.germ
		callbackUrl: http://backstage.47fc360e217349b384cd.ge
		clientId: ${AUTH_GITHUB_CLIENT_ID}
		clientSecret: ${AUTH_GITHUB_CLIENT_SECRET}

homepage:
  clocks:
    - label: UTC
	  timezone: UTC
	- label: BER
	  timezone: 'Europe/Berlin'
	# add Budapest, SaintPetersburg, Pune, etc???
```
