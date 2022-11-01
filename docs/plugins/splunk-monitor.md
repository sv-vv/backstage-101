- [Backstage Plugins](#backstage-plugins)
  - [Create front-end plugin](#create-front-end-plugin)
    - [Plugin development](#plugin-development)
    - [Integrate splunk-monitor card into Software Catalog](#integrate-splunk-monitor-card-into-software-catalog)
      - [**Create splunk-monitor card**](#create-splunk-monitor-card)
      - [**Show splunk-monitor card**](#show-splunk-monitor-card)
    - [The UML diagram of our front-end plugin](#the-uml-diagram-of-our-front-end-plugin)
  - [## API calls](#-api-calls)
    - [Proxy configurations](#proxy-configurations)
    - [Calling proxy API](#calling-proxy-api)
  - [Connect to Splunk](#connect-to-splunk)
# Backstage Plugins

Our goal is to create a plugin that integrates with Splunk, and will show information for apps in Software Catalog. 

## Create front-end plugin

---

To create a Backstage plugin we should follow the documantation on [backstage.io][createBackstagePlugin-link]. To create Splunk monitor plugin, after the backstage application is created we should run:

```bash
yarn new --select plugin
```
after we enter the name of our plugin `splunk-monitor` in our case, our plugin is created in `plugins` folder.

![splunk-monitor front-end plugin folder](/docs/assets/splunk-monitor/splunk-front-end-plugin-folder.png)

After the plugin is created we can run our plugin in isolation with following command

```bash
yarn --cwd plugins/splunk-monitor/dev start
```

A default plugin page is shown with data from [randomuser.me][randomuser-me-link]

![splunk-monitor front-end plugin started in isolation](/docs/assets/splunk-monitor/splunk-front-end-isolation.png)

To have the plugin page the ```packages/app``` is updated *(this package contains the front-end application)*, ```packages/app/package.json``` is updated with plugins package name ```@internal/plugin-splunk-monitor``` in our case, and ```App.tsx``` is updated with link to the plugin page.

```typescript
import { SplunkMonitorPage } from '@internal/plugin-splunk-monitor';
...
const routes = {
  <FlatRoutes>
    ...
    <Route path="/splunk-monitor" element={<SplunkMonitorPage />} />
  </FlatRoutes>
}
```
### Plugin development

---
Each plugin is a self-contained web application and can include any type of content. To develop a plugin we should use ```Typescript```, use [Backstage components][backstageComponents-link], or rely on [Material-UI][material-ui-link]

By default our plugins folder structure will be like bellow

![splunk-monitor plugin folder structure](/docs/assets/splunk-monitor/splunk-front-end-folder-structure.png)

To have a mount point to our extensions exposed by our plugin in ```src/routes.ts``` file a ```RouteRef``` instance is created.
```typescript
import { createRouteRef } from '@backstage/core-plugin-api';

export const rootRouteRef = createRouteRef({
  id: 'splunk-monitor',
});
```
Our extensions will be exposed by ```src/plugin.ts```.
We created a splunk monitor card.

```typescript
export const splunkMonitorPlugin = createPlugin({
  id: 'splunk-monitor',
  routes: {
    root: rootRouteRef,
  },
});

export const EntitySplunkMonitorCard = splunkMonitorPlugin.provide(
  createRoutableExtension({
    name: 'EntitySplunkMonitorCard',
    component: () =>
      import('./components/EntitySplunkMonitorCard').then(m => m.EntitySplunkMonitorCard),
    mountPoint: rootRouteRef,
  }),
);
```
After creating or updateing our ```EntitySplunkMonitorCard``` our ```components``` folder structure will contain:


![splunk-plugin-folder-content-2](/docs/assets/splunk-monitor/splunk-front-end-folder-structure-2.png)

their content is shown in next section.

### Integrate splunk-monitor card into Software Catalog

---

#### **Create splunk-monitor card**

We create an ```EntitySplunkMonitorCard``` component. We use the ```useEntity()``` hook to have access to the context of the entity page into which our plugin will be embedded.

```typescript
import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { InfoCard } from '@backstage/core-components';
import { SplunkMonitorFetchComponent } from '../SplunkMonitorFetchComponent';

export const EntitySplunkMonitorCard = () => {
  const { entity } = useEntity();

  return (
    <InfoCard title="Splunk monitor">
      <p>App: {entity.metadata.name}</p>
      <SplunkMonitorFetchComponent />
    </InfoCard>
  );
}
```

#### **Show splunk-monitor card**
To show a card in the software catalog entities page we need to connect the created plugin card with our front-end application. We are doing this by updating the ```packages/app/src/components/catalog/EntityPage.tsx``` based on what kind of entities we want to show the splunk-monitor card, we update the given children in the ```<EntitySwitch>``` component.

In our case we want to display the created plugin card on entities of type components and api.

```typescript
export const entityPage = (
  <EntitySwitch>
    <EntitySwitch.Case if={isKind('component')} children={componentPage} />
    <EntitySwitch.Case if={isKind('api')} children={apiPage} />
    <EntitySwitch.Case if={isKind('group')} children={groupPage} />
    <EntitySwitch.Case if={isKind('user')} children={userPage} />
    <EntitySwitch.Case if={isKind('system')} children={systemPage} />
    <EntitySwitch.Case if={isKind('domain')} children={domainPage} />

    <EntitySwitch.Case>{defaultEntityPage}</EntitySwitch.Case>
  </EntitySwitch>
);
```
```overviewContent``` is shown for components

```typescript
const overviewContent = (
  <Grid container spacing={3} alignItems="stretch">
    {...}
    <Grid container item md={12}>
      <Grid item md={6}>
        <EntitySplunkMonitorCard />
      </Grid>
    </Grid>
  </Grid>
);
```

### The UML diagram of our front-end plugin

![UML diagram of splunk-monitor front-end plugin](/docs/assets/splunk-monitor/splunk-front-end-UML-diagram.png)

## API calls
---
### Proxy configurations
To make api calls through the implemented Backstage proxy we need to add route configuration for ```/spulnkmonitor``` settings in the ```app-config.yaml``` file

```yaml
...
proxy:
  '/splunkmonitor':
    target: 'http://localhost:3003'
    changeOrigin: true
    headers:
      Authorization: ${SPLUNK_API_KEY}
...
```
### Calling proxy API
We created and ```plugins/splunk-monitor/src/api``` folder and added the ```types.ts``` and ```SplunkMonitorApiClient.ts``` files. In ```types.ts``` we used the pattern suggested from [backstage.io][callApiThroughProxyInBackstage-link]

We added an interface for our API and then used the ```createApiRef()``` to create the ```ApiRef```

```typescript
import { createApiRef } from "@backstage/core-plugin-api";

export interface SplunkMonitorApi {
    getStatus(): Promise<Response>;
  }

export const splunkMonitorApiRef = createApiRef<SplunkMonitorApi>({
  id: 'plugin.splunk-monitor.service'
});
```
In ```SplunkMonitorApiClient``` we implement the above mentioned Api client interface. In that implementation we will use the ```DiscoveryApi``` mechanism to retrieve the endpoint for ```/splunkmonitor```, and we will do our API request.

```typescript
import { DiscoveryApi } from "@backstage/core-plugin-api";
import { SplunkMonitorApi } from "./types";

export class SplunkMonitorApiClient implements SplunkMonitorApi {
  private readonly discoveryApi: DiscoveryApi;

  constructor(options: { discoveryApi: DiscoveryApi }) {
    this.discoveryApi = options.discoveryApi;
  }

  async getStatus(): Promise<Response> {
    const baseUrl = `${await this.discoveryApi.getBaseUrl('proxy')}/splunkmonitor`;
    
    const statusUrl = `${baseUrl}/app-status`
    const response = await fetch(statusUrl, {
      method: 'POST'
    });
    return response;
  }
}
```
To call the API client method ```getStatus()``` the ```useApi()``` React hook is used, which get as parameter the ```ApiRef``` created above with ```createApiRef()``` method.

```typescript
import { useApi } from "@backstage/core-plugin-api";
import useAsync from "react-use/lib/useAsync";
import { splunkMonitorApiRef } from "../api/types";

export const useSplunkMonitorApi = () => {
  const splunkMonitorApi = useApi(splunkMonitorApiRef);

  return useAsync(async (): Promise<any[]> => {

    const response = await splunkMonitorApi.getStatus();
    const data = await response.json();
    return data.status;
  }, []);

}
```

## Connect to Splunk

- steps to connect to Splunk index
  - ticket to Splunk team 
- add config schema file in the root folder of your plugin in plugins/splunk-monitor-backend in our case


[createBackstagePlugin-link]: https://backstage.io/docs/plugins/create-a-plugin
[backstageComponents-link]:https://backstage.io/storybook/?path=/story/plugins-examples--plugin-with-data 
[material-ui-link]: https://mui.com/core/
[randomuser-me-link]: https://randomuser.me
[callApiThroughProxyInBackstage-link]: https://backstage.io/docs/tutorials/using-backstage-proxy-within-plugin#calling-an-api-using-the-backstage-proxy