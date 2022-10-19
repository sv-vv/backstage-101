import { createRouter } from '@internal/plugin-first-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { Knex } from 'knex';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const db: Knex<any, unknown[]> = await env.database.getClient();
  // Here is where you will add all of the required initialization code that
  // your backend plugin needs to be able to start!

  // The env contains a lot of goodies, but our router currently only
  // needs a logger
  return await createRouter({
    logger: env.logger,
  });
}
