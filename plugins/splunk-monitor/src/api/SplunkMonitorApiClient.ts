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