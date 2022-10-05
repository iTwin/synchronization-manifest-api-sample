/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ExternalFile } from '../typedef/types';

/*
 * A hook which fetches External Storage Files from ExternalStorageDrive depending on the setup
 */
export function useExternalStorage(): [() => Promise<ExternalFile[]>] {
  const getExternalStorageFiles = async (): Promise<ExternalFile[]> => {
    const responseObject = await fetch(`/getExternalStorageFiles`, {
      method: 'GET',
    });

    const files = await responseObject.json();
    return files as ExternalFile[];
  };

  return [getExternalStorageFiles];
}
