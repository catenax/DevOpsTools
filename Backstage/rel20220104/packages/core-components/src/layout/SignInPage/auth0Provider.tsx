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

import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { InfoCard } from '../InfoCard/InfoCard';
import { ProviderComponent, ProviderLoader, SignInProvider } from './types';
import {
  useApi,
  auth0AuthApiRef,
  errorApiRef,
} from '@backstage/core-plugin-api';
import { ForwardedError } from '@backstage/errors';
import { UserIdentity } from './UserIdentity';

const Component: ProviderComponent = ({ onSignInSuccess }) => {
  const auth0AuthApi = useApi(auth0AuthApiRef);
  const errorApi = useApi(errorApiRef);

  const handleLogin = async () => {
    try {
      const identityResponse = await auth0AuthApi.getBackstageIdentity({
        instantPopup: true,
      });
      if (!identityResponse) {
        throw new Error(
          'The Auth0 provider is not configured to support sign-in',
        );
      }

      const profile = await auth0AuthApi.getProfile();

      onSignInSuccess(
        UserIdentity.create({
          identity: identityResponse.identity,
          authApi: auth0AuthApi,
          profile,
        }),
      );
    } catch (error) {
      errorApi.post(new ForwardedError('Auth0 login failed', error));
    }
  };

  return (
    <Grid item>
      <InfoCard
        title="Auth0"
        actions={
          <Button color="primary" variant="outlined" onClick={handleLogin}>
            Sign In
          </Button>
        }
      >
        <Typography variant="body1">Sign In using Auth0</Typography>
      </InfoCard>
    </Grid>
  );
};

const loader: ProviderLoader = async apis => {
  const auth0AuthApi = apis.get(auth0AuthApiRef)!;

  const identityResponse = await auth0AuthApi.getBackstageIdentity({
    optional: true,
  });

  if (!identityResponse) {
    return undefined;
  }

  const profile = await auth0AuthApi.getProfile();
  return UserIdentity.create({
    identity: identityResponse.identity,
    authApi: auth0AuthApi,
    profile,
  });
};

export const auth0Provider: SignInProvider = { Component, loader };
