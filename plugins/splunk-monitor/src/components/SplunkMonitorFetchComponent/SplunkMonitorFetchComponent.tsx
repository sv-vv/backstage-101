import React from 'react';
import { Progress } from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import { useSplunkMonitorApi } from '../../hooks/useSplunkMonitor';

export const SplunkMonitorFetchComponent = () => {
  const { value, loading, error } = useSplunkMonitorApi();

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">ERROR: while querying app status service!</Alert>;
  }

  return (<span>Application status: {value}</span>);
};
