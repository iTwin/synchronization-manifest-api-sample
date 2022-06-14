/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { components } from './Synchronization';

export type AuthorizationInformation = components['schemas']['AuthorizationInformation'];
export type ManifestConnection = components['schemas']['ManifestConnection'];
export type ManifestRunResponse = components['schemas']['manifest-run-response'];
export type ManifestFile = components['schemas']['ManifestFile'];

export type FileAccessObject = {
    accessUrl: string;
}

export type FolderAccessObject = {
    accessUrl: string;
}