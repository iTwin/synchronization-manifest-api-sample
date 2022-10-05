/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { RouteComponentProps } from '@reach/router';
import { useEffect, useMemo, useState } from 'react';
import { iModelId } from '../../env';
import './synchronizationPage.scss';
import { Button, ProgressLinear, Title } from '@itwin/itwinui-react';
import { useExternalStorage } from '../../hooks/useExternalAPI';
import { Table } from '@itwin/itwinui-react';
import {
  firstTableColumns,
  secondTableColumns,
} from '../tableColumns/tableColumns';
import {
  getFileState,
  getSynchronizedDate,
  setRunStatusLabel,
} from '../../helpers/formatters';
import { useSynchronizationService } from '../../services/synchronizationService';
import { RunResult, ExternalFile } from '../../typedef/types';
import { connectionName } from '../../setup';

/*
 * SynchronizationPage a component represents and manages all data about External Files and Run Results
 */
export const SynchronizationPage = (props: RouteComponentProps) => {
  const [connectionId, setConnectionId] = useState<string>();
  const [externalFiles, setExternalFiles] = useState<ExternalFile[]>([]);
  const [connectionInputFiles, setConnectionInputFiles] = useState<
    ExternalFile[]
  >([]);
  const [runResult, setRunResult] = useState<RunResult>();
  const [interval, setInterval] = useState<number>();
  const [
    getApplicationConnection,
    getManifestConnectionRun,
    runManifestConnection,
    addNewManifestConnectionFiles,
    deleteMissingManifestConnectionFiles,
    areRunsLoading,
  ] = useSynchronizationService();
  const [getExternalStorageFiles] = useExternalStorage();

  const fetchResults = async (connectionId: string) => {
    const connectionRun = await getManifestConnectionRun(connectionId);
    setRunResult(connectionRun);

    if (connectionRun && connectionRun.state !== 'Completed') {
      clearInterval(interval);
      const newInterval = window.setInterval(async () => {
        const connectionRun = await getManifestConnectionRun(connectionId!);
        setRunResult(connectionRun);
      }, 20000);
      setInterval(newInterval);
    }
  };

  const manifestConnectionRun = async () => {
    // Run Manifest connection
    const runLocation: string | null = await runManifestConnection(
      connectionId!,
      connectionInputFiles!
    );

    // Get Manifest connection run results
    if (connectionId) {
      fetchResults(connectionId);
    }
  };

  useEffect(() => {
    const setRun = async () => {
      // Set External files
      const externalStorageFiles = await getExternalStorageFiles();
      setExternalFiles(externalStorageFiles);
      // Get Manifest connection last run results
      if (connectionId !== undefined) {
        // Delete Manifest connection files which were removed from external storage
        await deleteMissingManifestConnectionFiles(
          connectionId,
          externalStorageFiles
        );
        // Add Manifest connection files which were newly added in external storage
        await addNewManifestConnectionFiles(connectionId, externalStorageFiles);
        await fetchResults(connectionId);
      }
    };

    setRun();
  }, [connectionId]);

  useEffect(() => {
    const setManifestConnectionId = async (inputFiles: ExternalFile[]) => {
      // Get Manifest connection last run results
      if (iModelId && connectionName && externalFiles) {
        const connection = await getApplicationConnection(
          connectionName,
          inputFiles
        );
        setConnectionId(connection?.id);
      }
    };

    // Set external files without folders
    if (externalFiles) {
      const inputFiles = externalFiles!.filter(file => file.isFolder === false);
      setConnectionInputFiles(inputFiles);
      setManifestConnectionId(inputFiles);
    }
  }, [externalFiles]);

  useEffect(() => {
    if (runResult && runResult.state === 'Completed') {
      clearInterval(interval);
    }
  }, [runResult]);

  const tableData1 = useMemo(
    () => (connectionInputFiles ? connectionInputFiles : []),
    [connectionInputFiles]
  );

  const tableData2 = useMemo(
    () =>
      connectionInputFiles &&
      runResult !== undefined &&
      runResult.runFileResults.length !== 0
        ? connectionInputFiles.map((file, fileIndex) => {
            return {
              id: file.id,
              name: file.name,
              result: runResult?.runFileResults?.[fileIndex]?.result,
              synchronizedDate: getSynchronizedDate(
                runResult?.runFileResults?.[fileIndex]
              ),
              fileType: file.isFolder,
              state: getFileState(runResult?.runFileResults?.[fileIndex], file),
              connectorType:
                runResult?.runFileResults?.[fileIndex]?.connectorType,
            };
          })
        : [],
    [connectionInputFiles, runResult]
  );

  const firstTableData = useMemo(firstTableColumns, [externalFiles]);

  const secondTableData = useMemo(secondTableColumns, [
    connectionInputFiles,
    runResult,
  ]);

  return (
    <div className="file-page">
      <div className="files-container">
        <Title className="title">Files from External storage</Title>
        <Table
          className="files"
          data={tableData1}
          emptyTableContent="No files from External storage"
          isLoading={connectionInputFiles.length === 0}
          isSortable={true}
          columns={firstTableData}
        />
      </div>
      <div className="action-container">
        <Button
          className="synchButton"
          disabled={
            !connectionId ||
            (runResult &&
              runResult?.runFileResults &&
              runResult.runFileResults.length === 0) ||
            connectionInputFiles.length === 0 ||
            (runResult && runResult.state !== 'Completed') ||
            areRunsLoading
          }
          onClick={manifestConnectionRun}
          styleType="high-visibility"
        >
          Synchronize
        </Button>
        {runResult?.state && runResult.state !== 'Completed' && (
          <ProgressLinear
            labels={[setRunStatusLabel(runResult.state)]}
            indeterminate={true}
          />
        )}
      </div>
      <div className="files-container">
        <Title className="title">Synchronized files</Title>
        <Table
          className="files"
          data={tableData2}
          emptyTableContent="Files are not synchronized"
          isLoading={
            !connectionId ||
            (runResult &&
              runResult?.runFileResults &&
              runResult.runFileResults.length === 0) ||
            connectionInputFiles.length === 0 ||
            areRunsLoading
          }
          isSortable={true}
          columns={secondTableData}
        />
      </div>
    </div>
  );
};
