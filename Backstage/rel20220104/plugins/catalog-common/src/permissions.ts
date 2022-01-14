/*
 * Copyright 2021 The Backstage Authors
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

import { Permission } from '@backstage/plugin-permission-common';

/**
 * {@link https://backstage.io/docs/features/software-catalog/software-catalog-overview}
 * @public
 */
export const RESOURCE_TYPE_CATALOG_ENTITY = 'catalog-entity';

/**
 * {@link https://backstage.io/docs/features/software-catalog/descriptor-format#kind-location}
 * @public
 */
export const RESOURCE_TYPE_CATALOG_LOCATION = 'catalog-location';

/**
 * This permission is used to authorize actions that involve reading one or more
 * entities from the catalog.
 *
 * If this permission is not authorized, it will appear that the entity does not
 * exist in the catalog — both in the frontend and in API responses.
 * @public
 */
export const catalogEntityReadPermission: Permission = {
  name: 'catalog.entity.read',
  attributes: {
    action: 'read',
  },
  resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
};

/**
 * This permission is used to designate actions that involve removing one or
 * more entities from the catalog.
 * @public
 */
export const catalogEntityDeletePermission: Permission = {
  name: 'catalog.entity.delete',
  attributes: {
    action: 'delete',
  },
  resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
};

/**
 * This permission is used to designate refreshing one or more entities from the
 * catalog.
 * @public
 */
export const catalogEntityRefreshPermission: Permission = {
  name: 'catalog.entity.refresh',
  attributes: {
    action: 'update',
  },
  resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
};

/**
 * This permission is used to designate actions that involve reading one or more
 * locations from the catalog.
 *
 * If this permission is not authorized, it will appear that the location does
 * not exist in the catalog — both in the frontend and in API responses.
 * @public
 */
export const catalogLocationReadPermission: Permission = {
  name: 'catalog.location.read',
  attributes: {
    action: 'read',
  },
  resourceType: RESOURCE_TYPE_CATALOG_LOCATION,
};

/**
 * This permission is used to designate actions that involve creating catalog
 * locations.
 * @public
 */
export const catalogLocationCreatePermission: Permission = {
  name: 'catalog.location.create',
  attributes: {
    action: 'create',
  },
  resourceType: RESOURCE_TYPE_CATALOG_LOCATION,
};

/**
 * This permission is used to designate actions that involve deleting locations
 * from the catalog.
 * @public
 */
export const catalogLocationDeletePermission: Permission = {
  name: 'catalog.location.delete',
  attributes: {
    action: 'delete',
  },
  resourceType: RESOURCE_TYPE_CATALOG_LOCATION,
};
