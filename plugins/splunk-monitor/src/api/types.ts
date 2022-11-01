import { createApiRef } from "@backstage/core-plugin-api";

export interface SplunkMonitorApi {
    getStatus(): Promise<Response>;
  }

export const splunkMonitorApiRef = createApiRef<SplunkMonitorApi>({
  id: 'plugin.splunk-monitor.service'
});