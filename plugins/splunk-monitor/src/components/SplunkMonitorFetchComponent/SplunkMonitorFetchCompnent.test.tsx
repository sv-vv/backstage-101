import React from 'react';
import { render } from '@testing-library/react';
import { SplunkMonitorFetchComponent } from './SplunkMonitorFetchComponent';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { setupRequestMockHandlers } from '@backstage/test-utils';

describe('SplunkMonitorFetchComponent', () => {
  const server = setupServer();
  // Enable sane handlers for network requests
  setupRequestMockHandlers(server);

  // setup mock response
  beforeEach(() => {
    server.use(
      rest.get('https://randomuser.me/*', (_, res, ctx) =>
        res(ctx.status(200), ctx.delay(2000), ctx.json({})),
      ),
    );
  });
  xit('should render', async () => {
    const rendered = render(<SplunkMonitorFetchComponent />);
    expect(await rendered.findByTestId('progress')).toBeInTheDocument();
  });
});
