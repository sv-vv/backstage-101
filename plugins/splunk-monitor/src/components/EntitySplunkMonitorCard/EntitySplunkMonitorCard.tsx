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
