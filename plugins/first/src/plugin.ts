import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const firstPlugin = createPlugin({
  id: 'first',
  routes: {
    root: rootRouteRef,
  },
});

export const FirstPage = firstPlugin.provide(
  createRoutableExtension({
    name: 'FirstPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
