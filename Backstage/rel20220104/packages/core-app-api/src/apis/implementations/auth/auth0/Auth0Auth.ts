/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { auth0AuthApiRef } from '@backstage/core-plugin-api';
import { OAuth2 } from '../oauth2';
import { OAuthApiCreateOptions } from '../types';

const DEFAULT_PROVIDER = {
  id: 'auth0',
  title: 'Auth0',
  icon: () => null,
};

/**
 * Implements the OAuth flow to Auth0 products.
 *
 * @public
 * @deprecated Use {@link OAuth2} instead
 *
 * @example
 *
 * ```ts
 * OAuth2.create({
 *   discoveryApi,
 *   oauthRequestApi,
 *   provider: {
 *     id: 'auth0',
 *     title: 'Auth0',
 *     icon: () => null,
 *   },
 *   defaultScopes: ['openid', 'email', 'profile'],
 *   environment: configApi.getOptionalString('auth.environment'),
 * })
 * ```
 */
export default class Auth0Auth {
  static create(options: OAuthApiCreateOptions): typeof auth0AuthApiRef.T {
    const {
      discoveryApi,
      environment = 'development',
      provider = DEFAULT_PROVIDER,
      oauthRequestApi,
      defaultScopes = ['openid', `email`, `profile`],
    } = options;

    return OAuth2.create({
      discoveryApi,
      oauthRequestApi,
      provider,
      environment,
      defaultScopes,
    });
  }
}
