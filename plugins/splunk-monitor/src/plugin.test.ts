import { splunkMonitorPlugin } from './plugin';

describe('splunk-monitor', () => {
  it('should export plugin', () => {
    expect(splunkMonitorPlugin).toBeDefined();
  });
});
