import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  discoveryApiRef
} from '@backstage/core-plugin-api';
import { SplunkMonitorApiClient } from './api/SplunkMonitorApiClient';
import { splunkMonitorApiRef } from './api/types';

import { rootRouteRef } from './routes';

export const splunkMonitorPlugin = createPlugin({
  id: 'splunk-monitor',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: splunkMonitorApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
      },
      factory: ({ discoveryApi }) => {
        return new SplunkMonitorApiClient({ discoveryApi })
      },
    }),
  ],
});

export const EntitySplunkMonitorCard = splunkMonitorPlugin.provide(
  createComponentExtension({
    name: 'EntitySplunkMonitorCard',
    component: {
      lazy: () => import('./components/EntitySplunkMonitorCard')
        .then(m => m.EntitySplunkMonitorCard),
    }

  }),
);

