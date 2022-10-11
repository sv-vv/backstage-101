---
id: sonarqube
title: Installing SonarQube plugin
---

## Getting started
SonarQube plugin comes in 2 packages. One for frontend app and the other for the backend.
You need to install both `@backstage/plugin-sonarqube` and `@backstage/plugin-sonarqube-backend` which the first one relies upon

## I `@backstage/plugin-sonarqube`
1. Installing @backstage/plugin-sonarqube

```shell
# From your Backstage root directory
yarn add --cwd packages/app @backstage/plugin-sonarqube
```
2. Add the EntitySonarQubeCard to the EntityPage:

```diff
  // packages/app/src/components/catalog/EntityPage.tsx
+ import { EntitySonarQubeCard } from '@backstage/plugin-sonarqube';

 ...

 const overviewContent = (
   <Grid container spacing={3} alignItems="stretch">
     <Grid item md={6}>
       <EntityAboutCard variant="gridItem" />
     </Grid>
+    <Grid item md={6}>
+      <EntitySonarQubeCard variant="gridItem" />
+    </Grid>
   </Grid>
 );
```
3. Add the `sonarqube.org/project-key` annotation to the `catalog-info.yaml` file of the target repo for which code quality analysis is needed.

```yaml
metadata:
  annotations:
    sonarqube.org/project-key: YOUR_INSTANCE_NAME/YOUR_PROJECT_KEY
```

`YOUR_INSTANCE_NAME/` is optional and will query the default instance if not provided.

## II `@backstage/plugin-sonarqube-backend`

1. Installing `@backstage/plugin-sonarqube-backend`
```shell
# From your Backstage root directory
yarn add --cwd packages/backend @backstage/plugin-sonarqube-backend
```

2. create a new `packages/backend/src/plugins/sonarqube.ts`
### sonarqube.ts
```typescript
import {
  createRouter,
  DefaultSonarqubeInfoProvider,
} from '@backstage/plugin-sonarqube-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    sonarqubeInfoProvider: DefaultSonarqubeInfoProvider.fromConfig(env.config),
  });
}
```
3. Reference it into `packages/backend/src/index.ts`
### src/index.ts
```typescript
import sonarqube from './plugins/sonarqube';

const sonarqubeEnv = useHotMemoize(module, () => createEnv('sonarqube'));
apiRouter.use('/sonarqube', await sonarqube(sonarqubeEnv));
```

4. Add configuration for it inside `app-config.yaml` file

#### Example - Single global instance 
```yaml
sonarqube:
  baseUrl: https://sonarcloud.io
  apiKey: ${SONARQUBE_TOKEN}
```

#### Example - Multiple global instance
```yaml
sonarqube:
  instances:
    - name: default
      baseUrl: https://sonarcloud.io
      apiKey: 123456789abcdef0123456789abcedf012
    - name: specialProject
      baseUrl: https://special-project-sonarqube.example.com
      apiKey: abcdef0123456789abcedf0123456789ab
```

###!Important
You need to match `YOUR_INSTANCE_NAME/` from `catalog-info.yaml` with one of the instance names provided in the config. Failing to do so, it will result in not linking the plugin correctly


Good luck!!!