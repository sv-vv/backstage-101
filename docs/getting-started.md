---
id: getting-started
title: Getting started with backstage
---

## What is backstage

In short, backstage is a catalog of software development products

Its purpose is to provide a centralized repo of ones application being developed. It's focusing on keeping the path to the apps, the docuemtation, the people that are working on or linked to the project..and as well as their dependencies.

With backstage, things should be simplified in a way that everything is in one place, the onboarding of new members is easier, the dependencies are easily spotted, in one word is good for tracking companies projects and their components.

## I. Install backstage app

### Prerequisites:
- curl or wget installed
- nodeJS active LTS version
    - nvm
    - npm
    - npx
- yarn Installation
- docker installation
- git installation

If the system is not directly accessible over your network the following ports need to be opened: 3000, 7007. This is quite uncommon, unless when you're installing in a container, VM or remote system.

To install backstage, you have 2 options. Either use the scaffolder app, or just go and clone the backstage repository.

### Method 1
Running the following comands:
```shell
npx @backstage/create-app
cd `<<backstage_app_name>>`
yarn dev
```


### Method 2
Start from your local development folder and get a backstage create-app repo
ex:
```shell
git clone --depth 1 git@github.com:backstage/backstage.git 
cd backstage
#Fetch our dependencies and run an initial build
yarn install
yarn tsc
yarn build
```
To run the app locally use:

```shell
yarn dev
```

or

```shell
yarn start
yarn start-backend 
```

e.q.
From your Backstage root directory

```shell
yarn --cwd packages/backend start
```

in separate windows

## II. Connect backstage app to a database

### Prerequisites
    - backstage works with postgresql
    - need to install postgresql and make port 5432 available (Listen :5432)
    - If the database is not hosted on the same server as the Backstage app, the PostgreSQL port needs to be accessible (the default is 5432 or 5433)

### Install postgresql on MAC
    - brew update
    - brew install postgresql
    - brew services start postgresql (start service)
    - brew services stop postgresql (stop service)
    - psql postgres (run)

***optional*** you should create a new user 
**************
```shell
CREATE ROLE ch_user WITH LOGIN PASSWORD 'bkApp2022';
ALTER ROLE ch_user CREATEDB;
CREATE DATABASE ch_user WITH OWNER=ch_user;

# GRANT future privileges
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public to ch_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public to ch_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public to ch_user;
```

```shell
#To specify default permissions that will be applied to future tables use:
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ch_user;
GRANT SELECT ON pg_database TO ch_user;
```
**************

Add pg plugin to backstage
From your Backstage root directory
```shell
yarn add --cwd packages/backend pg
```

In app-config.yaml and add your PostgreSQL configuration.
```yaml
backend:
  database:
    # config options: https://node-postgres.com/api/client
    client: pg
    # if you want to use only 1 database for all plugins uncomment the following line
    pluginDivisionMode: schema
    connection:
      host: ${POSTGRES_HOST}
      port: ${POSTGRES_PORT}
      user: ${POSTGRES_USER}
      password: ${POSTGRES_PASSWORD}
      # https://node-postgres.com/features/ssl
      #ssl: require # see https://www.postgresql.org/docs/current/libpq-ssl.html Table 33.1. SSL Mode Descriptions (e.g. require)
        #ca: # if you have a CA file and want to verify it you can uncomment this section
        #$file: <file-path>/ca/server.crt
```

Export the env variables into a sh script
```shell
export POSTGRES_HOST=127.0.0.1
export POSTGRES_PORT=5432
export POSTGRES_USER=chuser
export POSTGRESS_PASSWORD=chuser_pass
```

and run the app with yarn dev


## III. Setting up authentication (with Github)
The authentication system in Backstage serves two distinct purposes: sign-in and identification of users, as well as delegating access to third-party resources. It is possible to configure Backstage to have any number of authentication providers, but only one of these will typically be used for sign-in, with the rest being used to provide access external resources.

1. first step will be to register an OAuth App on Github (https://github.com/settings/applications/new)
  - Homepage URL: http://localhost:3000
  - CallBack URL: http://localhost:7007/api/auth/github/handler/frame
      (These will change in the future)
2. after, get Client ID and Client Secret and add then into app-config.yaml
```yaml
auth:
  # see https://backstage.io/docs/auth/ to learn about auth providers
  environment: development
  providers:
    github:
      development:
        clientId: YOUR CLIENT ID
        clientSecret: YOUR CLIENT SECRET
```
3. Add SignInPage to frontend app (add the following lines in file packages/app/src/App.tsx)
```typescript
import { githubAuthApiRef } from '@backstage/core-plugin-api';
import { SignInPage } from '@backstage/core-components';

//Search for const app = createApp({ in this file, and below apis, add:

components: {
  SignInPage: props => (
    <SignInPage
      {...props}
      auto
      provider={{
        id: 'github-auth-provider',
        title: 'GitHub',
        message: 'Sign in using GitHub',
        apiRef: githubAuthApiRef,
      }}
    />
  ),
},
```

4. Setting up a GitHub Integration
The GitHub integration supports loading catalog entities from GitHub
   - Create your Personal Access Token (https://github.com/settings/tokens/new)
   - add it to app-config.yaml file
```yaml
integrations:
  github:
    - host: github.com
      token: ${GITHUB_TOKEN} # this should be the token from GitHub
```

## IV. Install Docker
Backstage needs Docker in order to use features like Software Templates and/or TechDocs
Follow the instructions here: https://docs.docker.com/engine/install/


## V. Create a plugin
run
```shell
yarn create-plugin
```
this will ask for an id, provide one;

after this step, a new plugin will be generated with the ID provided. It will be built and added to the app automatically
You should be able to see the plugin imediatly here http://localhost:3000/`<<PLUGIN_ID>>`

You can also serve the plugin in isolation by running yarn start in the plugin directory. Or by using the yarn workspace command, for example:
```shell
yarn workspace @internal/plugin-<<PLUGIN_ID>> start # Also supports --check
```
To check the current workspaces run
```shell
yarn workspaces info 
```

@backstage/create-app@0.4.31