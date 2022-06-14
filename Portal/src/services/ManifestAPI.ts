/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { iModelId } from '../env';
import { useAuthContext } from '../auth/AuthContext';
import {
  FileAccessObject,
  ManifestConnection,
  ManifestFile,
  ManifestRunResponse,
} from '../dto/Types';
import { apiDomain } from '../setup';
import { JSHash, CONSTANTS } from 'react-native-hash';

export const useManifestConnections = (
  fileName: string | null
): [
  () => Promise<string | undefined>,
  (connectionDefinitionId: string) => Promise<string | null>,
  (runLocation: string) => Promise<ManifestRunResponse>
] => {
  const { user } = useAuthContext();

  const fetchConnectionDefinitionId = async (): Promise<string | undefined> => {
    // check if iModel already contains source file
    const connectionDefinitionIdIfiModelAlreadyContainsFile =
      await isFileAlreadyInConnection();
    if (connectionDefinitionIdIfiModelAlreadyContainsFile != null) {
      return connectionDefinitionIdIfiModelAlreadyContainsFile;
    }
    // Create Manifest connection definition
    const createConnectionResponse = await createManifestConnectionDefinition();
    return createConnectionResponse.id;
  };

  const isFileAlreadyInConnection = async (): Promise<string | null> => {
    const newfileId = await JSHash(fileName!, CONSTANTS.HashAlgorithms.sha256);
    const connectionResult: ManifestConnection[] = await fetchConnections();
    for (let connection of connectionResult) {
      const sourceFileResult = await fetchSourceFiles(connection.id!);
      if (sourceFileResult.find(i => i.sourceFileId === newfileId))
        return connection.id!;
    }
    return null;
  };

  const createManifestConnectionDefinition =
    async (): Promise<ManifestConnection> => {
      const newfileId = await JSHash(
        fileName!,
        CONSTANTS.HashAlgorithms.sha256
      );

      const requestHeaders = {
        Authorization: 'Bearer ' + user!.access_token,
        'Content-Type': 'application/json',
      };

      const requestBody = {
        displayName: 'Manifest connection ' + newfileId,
        iModelId: iModelId,
        authenticationType: 'User',
        sourceFiles: [
          {
            sourceFileId: newfileId,
          },
        ],
      };

      const response = await fetch(
        `${apiDomain}/synchronization/imodels/manifestConnections`,
        {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: requestHeaders,
        }
      );

      const result = await response.json();
      return result.connection as ManifestConnection;
    };

  const runManifestConnectionDefinition = async (
    connectionDefinitionId: string
  ): Promise<string | null> => {
    const newfileId = await JSHash(fileName!, CONSTANTS.HashAlgorithms.sha256);
    const responseObject = await fetch(
      `/getFileAccessUrl?fileName=${fileName}`,
      {
        method: 'GET',
      }
    );

    const accessObject: FileAccessObject = await responseObject.json();

    const requestHeaders = {
      Authorization: 'Bearer ' + user!.access_token,
      'Content-Type': 'application/json',
    };

    const requestBody = {
      sourceFiles: [
        {
          id: newfileId,
          name: fileName,
          url: accessObject.accessUrl,
          connector: 'MSTN',
          children: [],
        },
      ],
    };

    const response = await fetch(
      `${apiDomain}/synchronization/imodels/manifestConnections/${connectionDefinitionId}/runs`,
      {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: requestHeaders,
      }
    );

    return response.headers.get('location');
  };

  const fetchRunResults = async (
    runLocation: string
  ): Promise<ManifestRunResponse> => {
    const requestHeaders = {
      Authorization: 'Bearer ' + user!.access_token,
      'Content-Type': 'application/json',
    };

    const response = await fetch(runLocation, {
      method: 'GET',
      headers: requestHeaders,
    });

    const result = await response.json();
    return result as ManifestRunResponse;
  };

  const fetchConnections = async (): Promise<ManifestConnection[]> => {
    const requestHeaders = {
      Authorization: 'Bearer ' + user!.access_token,
      'Content-Type': 'application/json',
    };
    const response = await fetch(
      `${apiDomain}/synchronization/imodels/connections?imodelId=${iModelId}`,
      {
        method: 'GET',
        headers: requestHeaders,
      }
    );
    const connections: ManifestConnection[] = (await response.json())
      .connections;
    return connections;
  };

  const fetchSourceFiles = async (
    connectionDefinitionId: string
  ): Promise<ManifestFile[]> => {
    const requestHeaders = {
      Authorization: 'Bearer ' + user!.access_token,
      'Content-Type': 'application/json',
    };
    const sourceFiles = await fetch(
      `${apiDomain}/synchronization/imodels/manifestConnections/${connectionDefinitionId}/sourcefiles`,
      {
        method: 'GET',
        headers: requestHeaders,
      }
    );

    const sourceFileResult: ManifestFile[] = (await sourceFiles.json())
      .sourceFiles;
    return sourceFileResult;
  };

  return [
    fetchConnectionDefinitionId,
    runManifestConnectionDefinition,
    fetchRunResults,
  ];
};
