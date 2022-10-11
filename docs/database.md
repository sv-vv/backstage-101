---
id: Database
title: Working with a database
sidebar_label: Database
description: How to connect to a database
---

by default, backstage comes bundled with 2 ways of storing data: 
1. memory based with sql_lite which works well locally (`yarn dev`)
2. database postgresql.

Backstage uses the Knex library, making it fairly easy to switch between database backends. 

## Enable postgresql
```shell
yarn add --cwd packages/backend pg
```

In app-config.yaml and add your PostgreSQL configuration.
```yaml
backend:
  database:
    client: pg
    pluginDivisionMode: schema
    connection:
      host: ${POSTGRES_HOST}
      port: ${POSTGRES_PORT}
      user: ${POSTGRES_USER}
      password: ${POSTGRES_PASSWORD}
```
More config options may be found here https://node-postgres.com/api/client.

The dependency for the database is handled by the `DatabaseManager` class which is part of the `@backstage/backend-common` package. Further doc here https://backstage.io/docs/reference/backend-common

After all this steps, backstage will automatically update the schema and do db migrations.

**Note:**
Each backstage plugin that uses database will have its own DB by example: `@backstage/catalog` will have catalog database inside your schema.

<img data-zoomable src="../assets/catalog_plugin_diagram.jpeg" alt="backstage_catalog" />