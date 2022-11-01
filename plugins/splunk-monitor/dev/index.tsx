import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { Entity } from '@backstage/catalog-model';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { splunkMonitorPlugin, EntitySplunkMonitorCard } from '../src/plugin';
import { SplunkMonitorApi, splunkMonitorApiRef } from '../src/api/types';
import { TestApiProvider } from '@backstage/test-utils';

const mockEntity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'backstage-app',
    description: 'Backstage application POC',
  },
  spec: {
    type: 'website',
    owner: 'backstage-boys',
    lifecycle: 'experimental'
  }
}
class MockSplunkMonitorApi implements SplunkMonitorApi {
  async getStatus(): Promise<{ status: string }> {
    return { status: 'ok' };
  }
}

createDevApp()
  .registerPlugin(splunkMonitorPlugin)
  .addPage({
    element: (
      <TestApiProvider apis={[[splunkMonitorApiRef, new MockSplunkMonitorApi]]}>
        <EntityProvider entity={mockEntity}>
          <EntitySplunkMonitorCard />
        </EntityProvider>
      </TestApiProvider>
    ),
    title: 'Splunk monitor',
    path: '/splunk-monitor'
  })
  .render();
