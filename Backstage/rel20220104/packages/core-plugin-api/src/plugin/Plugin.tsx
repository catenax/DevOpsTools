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

import {
  PluginConfig,
  PluginOutput,
  BackstagePlugin,
  Extension,
  AnyRoutes,
  AnyExternalRoutes,
  PluginFeatureFlagConfig,
} from './types';
import { AnyApiFactory } from '../apis';

/**
 * @internal
 */
export class PluginImpl<
  Routes extends AnyRoutes,
  ExternalRoutes extends AnyExternalRoutes,
> implements BackstagePlugin<Routes, ExternalRoutes>
{
  private storedOutput?: PluginOutput[];

  constructor(private readonly config: PluginConfig<Routes, ExternalRoutes>) {}

  getId(): string {
    return this.config.id;
  }

  getApis(): Iterable<AnyApiFactory> {
    return this.config.apis ?? [];
  }

  getFeatureFlags(): Iterable<PluginFeatureFlagConfig> {
    const registeredFlags = this.output()
      .filter(({ type }) => type === 'feature-flag')
      .map(({ name }) => ({ name }));

    return registeredFlags;
  }

  get routes(): Routes {
    return this.config.routes ?? ({} as Routes);
  }

  get externalRoutes(): ExternalRoutes {
    return this.config.externalRoutes ?? ({} as ExternalRoutes);
  }

  output(): PluginOutput[] {
    if (this.storedOutput) {
      return this.storedOutput;
    }
    const outputs = new Array<PluginOutput>();
    this.storedOutput = outputs;

    if (this.config.featureFlags) {
      for (const flag of this.config.featureFlags) {
        outputs.push({ type: 'feature-flag', name: flag.name });
      }
    }

    if (!this.config.register) {
      return outputs;
    }

    this.config.register({
      featureFlags: {
        register(name) {
          outputs.push({ type: 'feature-flag', name });
        },
      },
    });

    return this.storedOutput;
  }

  provide<T>(extension: Extension<T>): T {
    return extension.expose(this);
  }

  toString() {
    return `plugin{${this.config.id}}`;
  }
}

/**
 * Creates Backstage Plugin from config.
 *
 * @param config - Plugin configuration.
 * @public
 */
export function createPlugin<
  Routes extends AnyRoutes = {},
  ExternalRoutes extends AnyExternalRoutes = {},
>(
  config: PluginConfig<Routes, ExternalRoutes>,
): BackstagePlugin<Routes, ExternalRoutes> {
  return new PluginImpl(config);
}
