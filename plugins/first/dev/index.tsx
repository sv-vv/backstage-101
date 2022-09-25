import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { firstPlugin, FirstPage } from '../src/plugin';

createDevApp()
  .registerPlugin(firstPlugin)
  .addPage({
    element: <FirstPage />,
    title: 'Root Page',
    path: '/first'
  })
  .render();
