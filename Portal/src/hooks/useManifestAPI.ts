/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { iModelId } from '../env';
import { useAuthContext } from '../auth/authContext';
import {
  ManifestConnection,
  ManifestRunResponse,
  ExternalFile,
  ManifestFile,
  ManifestJob,
  ManifestTask,
  RunFileResult,
  RunResult,
} from '../typedef/types';
import { apiDomain, connectionName } from '../setup';
import { useConnectorForFile } from '../services/connectorLogic';

export const useManifestConnections = (): [
  (
    connectionName: string | undefined
  ) => Promise<ManifestConnection | undefined>,
  (connectionDefinitionId: string) => Promise<ManifestFile[]>,
  (runLocation: string) => Promise<RunResult>,
  (connectionDefinitionId: string) => Promise<string | undefined>,
  (externalFiles: ExternalFile[]) => Promise<ManifestConnection>,
  (
    connectionDefinitionId: string,
    externalFiles: ExternalFile[],
    sourceFiles: ManifestFile[]
  ) => Promise<string | null>,
  (connectionDefinitionId: string, file: ExternalFile) => Promise<Response>,
  (connectionDefinitionId: string, sourceFileId: string) => Promise<Response>
] => {
  const { user } = useAuthContext();

  const [getAllowedConnectorTypeForFile] = useConnectorForFile();

  const requestHeaders = {
    Authorization: 'Bearer ' + user!.access_token,
    'Content-Type': 'application/json',
  };

  const createManifestConnectionDefinition = async (
    externalFiles: ExternalFile[]
  ): Promise<ManifestConnection> => {
    const sourceFilesCollection = externalFiles.map((file: ExternalFile) => {
      return { sourceFileId: file.id };
    });

    const requestBody = {
      displayName: connectionName,
      iModelId: iModelId,
      authenticationType: 'User',
      sourceFiles: sourceFilesCollection,
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
    connectionDefinitionId: string,
    externalFiles: ExternalFile[],
    sourceFiles: ManifestFile[]
  ): Promise<string | null> => {
    const sourceFilesResult = sourceFiles.map((item: ManifestFile) => {
      const file = externalFiles.find(
        (externalFile: ExternalFile) => externalFile.id === item.sourceFileId
      );

      if (file) {
        return {
          id: file.id,
          name: file.name,
          url: `${file.downloadUrl}`,
          connector: getAllowedConnectorTypeForFile(file.name),
          children: [],
        };
      }
    });

    const response = await fetch(
      `${apiDomain}/synchronization/imodels/manifestConnections/${connectionDefinitionId}/runs`,
      {
        method: 'POST',
        body: JSON.stringify({
          sourceFiles: sourceFilesResult,
        }),
        headers: requestHeaders,
      }
    );

    return response.headers.get('location');
  };

  const getManifestConnectionRunResults = async (
    runLocation: string
  ): Promise<RunResult> => {
    const response = await fetch(runLocation, {
      method: 'GET',
      headers: requestHeaders,
    });

    const result: ManifestRunResponse = await response.json();

    const tasks: RunFileResult[] = [];
    if (result?.run?.jobs) {
      result.run.jobs.forEach((job: ManifestJob) => {
        const connectorType = job.connectorType;
        job.tasks?.forEach((task: ManifestTask) => {
          tasks.push({
            connectorType,
            ...task,
          });
        });
      });
    }

    return {
      state: result?.run?.state ? result.run.state : '',
      runFileResults: tasks,
    };
  };

  const getManifestConnection = async (
    connectionName: string | undefined
  ): Promise<ManifestConnection | undefined> => {
    const response = await fetch(
      `${apiDomain}/synchronization/imodels/connections?imodelId=${iModelId}`,
      {
        method: 'GET',
        headers: requestHeaders,
      }
    );

    const result = await response.json();
    const connection = result.connections.filter(
      (connection: any) => connection.displayName === connectionName
    ) as ManifestConnection[];

    return connection.length > 0 ? connection[0] : undefined;
  };

  const getManifestConnectionSourceFiles = async (
    connectionDefinitionId: string
  ): Promise<ManifestFile[]> => {
    const response = await fetch(
      `${apiDomain}/synchronization/imodels/manifestConnections/${connectionDefinitionId}/sourcefiles`,
      {
        method: 'GET',
        headers: requestHeaders,
      }
    );

    const result = await response.json();
    return result.sourceFiles as ManifestFile[];
  };

  const getManifestConnectionRunLocation = async (
    connectionDefinitionId: string
  ): Promise<string | undefined> => {
    const response = await fetch(
      `${apiDomain}/synchronization/imodels/manifestConnections/${connectionDefinitionId}`,
      {
        method: 'GET',
        headers: requestHeaders,
      }
    );

    const result = await response.json();
    return result?.connection?._links?.lastRun
      ? result.connection._links.lastRun.href
      : undefined;
  };

  const addManifestConnectionFile = async (
    connectionDefinitionId: string,
    file: ExternalFile
  ): Promise<Response> => {
    const response = await fetch(
      `${apiDomain}/synchronization/imodels/manifestConnections/${connectionDefinitionId}/sourcefiles`,
      {
        method: 'POST',
        body: JSON.stringify({
          sourceFileId: file.id,
        }),
        headers: requestHeaders,
      }
    );

    return response;
  };

  const deleteManifestConnectionFile = async (
    connectionDefinitionId: string,
    sourceFileId: string
  ): Promise<Response> => {
    const response = await fetch(
      `${apiDomain}/synchronization/imodels/manifestConnections/${connectionDefinitionId}/sourcefiles/${sourceFileId}`,
      {
        method: 'DELETE',
        headers: requestHeaders,
      }
    );

    return response;
  };

  return [
    getManifestConnection,
    getManifestConnectionSourceFiles,
    getManifestConnectionRunResults,
    getManifestConnectionRunLocation,
    createManifestConnectionDefinition,
    runManifestConnectionDefinition,
    addManifestConnectionFile,
    deleteManifestConnectionFile,
  ];
};
