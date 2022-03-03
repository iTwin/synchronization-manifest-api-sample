/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ContainerClient } from '@azure/storage-blob';
import { FolderAccessObject } from '../dto/Types';

export const uploadFileToAzureBlob = async (file: File | null): Promise<string | null> => {
  if (!file) {
    return null;
  }

  const response = await fetch(`/getFolderAccessUrl`, {
    method: 'GET'
  });

  const accessObject: FolderAccessObject = await response.json();
  const containerClient: ContainerClient = new ContainerClient(accessObject.accessUrl);

  // create blobClient for container
  const blobClient = containerClient.getBlockBlobClient(file.name);

  // set mimetype as determined from browser with file upload control
  const options = { blobHTTPHeaders: { blobContentType: file.type } };

  // upload file
  await blobClient.uploadData(file, options);

  return file.name;
};
