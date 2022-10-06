/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { useState } from 'react';
import {
  ManifestConnection,
  ExternalFile,
  ManifestFile,
  RunResult,
} from '../typedef/types';
import { useManifestConnections } from '../hooks/useManifestAPI';

export const useSynchronizationService = (): [
  (
    connectionName: string | undefined,
    externalFiles: ExternalFile[]
  ) => Promise<ManifestConnection>,
  (connectionDefinitionId: string) => Promise<RunResult | undefined>,
  (
    connectionDefinitionId: string,
    externalFiles: ExternalFile[]
  ) => Promise<string | null>,
  (
    connectionDefinitionId: string,
    externalFiles: ExternalFile[]
  ) => Promise<void>,
  (
    connectionDefinitionId: string,
    externalFiles: ExternalFile[]
  ) => Promise<void>,
  boolean
] => {
  const [
    getManifestConnection,
    getManifestConnectionSourceFiles,
    getManifestConnectionRunResults,
    getManifestConnectionRunLocation,
    createManifestConnectionDefinition,
    runManifestConnectionDefinition,
    addManifestConnectionFile,
    deleteManifestConnectionFile,
  ] = useManifestConnections();

  const [areRunsLoading, setAreRunsLoading] = useState(true);

  // In the application, we use only one connection. New connection creation happens only if there is no existing connection.
  const getApplicationConnection = async (
    connectionName: string | undefined,
    externalFiles: ExternalFile[]
  ): Promise<ManifestConnection> => {
    // Check if connection already exists
    const connection = await getManifestConnection(connectionName);

    return connection !== undefined
      ? connection
      : await createManifestConnectionDefinition(externalFiles);
  };

  const getManifestConnectionRun = async (
    connectionDefinitionId: string
  ): Promise<RunResult | undefined> => {
    const runLocationResult = await getManifestConnectionRunLocation(
      connectionDefinitionId
    );

    setAreRunsLoading(false);
    return runLocationResult
      ? await getManifestConnectionRunResults(runLocationResult)
      : undefined;
  };

  const runManifestConnection = async (
    connectionDefinitionId: string,
    externalFiles: ExternalFile[]
  ): Promise<string | null> => {
    const sourceFiles: ManifestFile[] = await getManifestConnectionSourceFiles(
      connectionDefinitionId
    );

    return await runManifestConnectionDefinition(
      connectionDefinitionId,
      externalFiles,
      sourceFiles
    );
  };

  const addNewManifestConnectionFiles = async (
    connectionDefinitionId: string,
    externalFiles: ExternalFile[]
  ) => {
    const sourceFiles: ManifestFile[] = await getManifestConnectionSourceFiles(
      connectionDefinitionId
    );

    externalFiles.forEach((externalFile: ExternalFile) => {
      if (
        sourceFiles.find(
          (sourceFile: ManifestFile) =>
            sourceFile.sourceFileId === externalFile.id
        ) === undefined
      ) {
        addManifestConnectionFile(connectionDefinitionId, externalFile);
      }
    });
  };

  const deleteMissingManifestConnectionFiles = async (
    connectionDefinitionId: string,
    externalFiles: ExternalFile[]
  ) => {
    const sourceFiles: ManifestFile[] = await getManifestConnectionSourceFiles(
      connectionDefinitionId
    );

    sourceFiles.forEach((sourceFile: ManifestFile) => {
      if (
        externalFiles.find(
          (externalFile: ExternalFile) =>
            externalFile.id === sourceFile.sourceFileId
        ) === undefined
      ) {
        deleteManifestConnectionFile(connectionDefinitionId, sourceFile.id!);
      }
    });
  };

  return [
    getApplicationConnection,
    getManifestConnectionRun,
    runManifestConnection,
    addNewManifestConnectionFiles,
    deleteMissingManifestConnectionFiles,
    areRunsLoading,
  ];
};
