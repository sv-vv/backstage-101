import { DEFAULT_NAMESPACE, stringifyEntityRef } from '@backstage/catalog-model';
import {
  createRouter,
  providers,
  defaultAuthProviderFactories,
} from '@backstage/plugin-auth-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    discovery: env.discovery,
    tokenManager: env.tokenManager,
    providerFactories: {
      ...defaultAuthProviderFactories,

      // This replaces the default GitHub auth provider with a customized one.
      // The `signIn` option enables sign-in for this provider, using the
      // identity resolution logic that's provided in the `resolver` callback.
      //
      // This particular resolver makes all users share a single "guest" identity.
      // It should only be used for testing and trying out Backstage.
      //
      // If you want to use a production ready resolver you can switch to
      // the one that is commented out below, it looks up a user entity in the
      // catalog using the GitHub username of the authenticated user.
      // That resolver requires you to have user entities populated in the catalog,
      // for example using https://backstage.io/docs/integrations/github/org
      //
      // There are other resolvers to choose from, and you can also create
      // your own, see the auth documentation for more details:
      //
      //   https://backstage.io/docs/auth/identity-resolver
      github: providers.github.create({
        signIn: {
          resolver({ result: { fullProfile } }, ctx) {
            if (!fullProfile.username) {
              throw new Error(
                'Login failed, user profile does not contain an email',
              );
            }

            // Next we verify the email domain. It is recommended to include this
            // kind of check if you don't look up the user in an external service.
            type GitHubProfile = typeof fullProfile & { _json?: { company: string; }; };
            const ghProfile: GitHubProfile = fullProfile;
            if (ghProfile._json?.company?.toLowerCase() !== 'softvision') {
              throw new Error(
                `Login failed, this company (${ghProfile._json?.company}) is not accepted`,
              );
            }

            // By using `stringifyEntityRef` we ensure that the reference is formatted correctly
            const userRef = stringifyEntityRef({
              kind: 'User',
              name: fullProfile.username,
              namespace: DEFAULT_NAMESPACE,
            });
            return ctx.issueToken({
              claims: {
                sub: userRef, // The user's own identity
                ent: [userRef], // A list of identities that the user claims ownership through
              },
            });
          },
//          resolver: providers.github.resolvers.usernameMatchingUserEntityName(),
        },
      }),
    },
  });
}
