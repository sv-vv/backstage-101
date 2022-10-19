import { RandomUserRow } from './types';

import { v4 as uuid } from 'uuid';

import {
  PluginDatabaseManager,
} from '@backstage/backend-common';

import { Knex } from 'knex';
import { applyDatabaseMigrations } from './migrations';

export class DatabaseRandowUserStore {
  private constructor(private readonly db: Knex) {}

  public static async create(
    database: PluginDatabaseManager,
  ): Promise<DatabaseRandowUserStore> {
    const knex = await database.getClient();

    if (!database.migrations?.skip) {
      await applyDatabaseMigrations(knex);
    }
    return new DatabaseRandowUserStore(knex);
  }

  async transaction<T>(fn: (tx: Knex.Transaction) => Promise<T>): Promise<T> {
    return await this.db.transaction(fn);
  }

  async getTransaction(): Promise<Knex.Transaction> {
    return this.db.transaction();
  }

  public async insert(tx: Knex.Transaction, randomUsers: RandomUserRow[]) {
    await tx<RandomUserRow>('random_user').insert(
        randomUsers.map(randomUser => ({
            ...randomUser,
            id: uuid(),
        })),
      );
  }
}