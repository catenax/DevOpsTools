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

import { ProfileInfo, BackstageIdentity } from '@backstage/core-plugin-api';
import { z } from 'zod';

/**
 * Session information for GitHub auth.
 *
 * @public
 */
export type GithubSession = {
  providerInfo: {
    accessToken: string;
    scopes: Set<string>;
    expiresAt?: Date;
  };
  profile: ProfileInfo;
  backstageIdentity: BackstageIdentity;
};

export const githubSessionSchema: z.ZodSchema<GithubSession> = z.object({
  providerInfo: z.object({
    accessToken: z.string(),
    scopes: z.set(z.string()),
    expiresAt: z.date().optional(),
  }),
  profile: z.object({
    email: z.string().optional(),
    displayName: z.string().optional(),
    picture: z.string().optional(),
  }),
  backstageIdentity: z.object({
    id: z.string(),
    token: z.string(),
    identity: z.object({
      type: z.literal('user'),
      userEntityRef: z.string(),
      ownershipEntityRefs: z.array(z.string()),
    }),
  }),
});
