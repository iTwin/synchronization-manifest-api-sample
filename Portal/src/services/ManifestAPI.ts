/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { iModelId } from '../env';
import { v4 as newGuid } from 'uuid';
import { useAuthContext } from '../auth/AuthContext';
import { FileAccessObject, ManifestConnection, ManifestRunResponse } from '../dto/Types';
import { apiDomain } from '../setup';

export const useManifestConnections = (): [
  () => Promise<ManifestConnection>,
  (connectionDefinitionId: string, fileName: string) => Promise<string | null>,
  (connectionDefinitionId: string) => Promise<ManifestRunResponse>
] => {
  const { user } = useAuthContext();
  const newfileId = newGuid();

  const createManifestConnectionDefinition = async (): Promise<ManifestConnection> => {
    const requestHeaders = {
      Authorization: 'Bearer ' + user!.access_token,
      'Content-Type': 'application/json'
    };

    const requestBody = {
      displayName: "Manifest connection " + newfileId,
      iModelId: iModelId,
      authenticationType: "User",
      sourceFiles: [{
        sourceFileId: newfileId
      }]
    }

    const response = await fetch(
      `${apiDomain}/synchronization/imodels/manifestConnections`,
      {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: requestHeaders,
      }
    );

    const result = await response.json();
    return result.connection as ManifestConnection;
  };

  const runManifestConnectionDefinition = async (connectionDefinitionId: string, fileName: string): Promise<string | null> => {
    const responseObject = await fetch(`/getFileAccessUrl?fileName=${fileName}`, {
      method: 'GET'
    });

    const accessObject: FileAccessObject = await responseObject.json();

    const requestHeaders = {
      Authorization: 'Bearer ' + user!.access_token,
      'Content-Type': 'application/json'
    };

    const requestBody = {
      sourceFiles: [{
        id: newfileId,
        name: fileName,
        url: accessObject.accessUrl,
        connector: "MSTN",
        children: []
      }]
    }

    const response = await fetch(
      `${apiDomain}/synchronization/imodels/manifestConnections/${connectionDefinitionId}/runs`,
      {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: requestHeaders,
      }
    );

    return response.headers.get('location');
  };

  const fetchRunResults = async (runLocation: string): Promise<ManifestRunResponse> => {
    const requestHeaders = {
      Authorization: 'Bearer ' + user!.access_token,
      'Content-Type': 'application/json'
    };

    const response = await fetch(runLocation,
      {
        method: 'GET',
        headers: requestHeaders,
      }
    );

    const result = await response.json();
    return result as ManifestRunResponse;
  };

  return [
    createManifestConnectionDefinition,
    runManifestConnectionDefinition,
    fetchRunResults,
  ];
}