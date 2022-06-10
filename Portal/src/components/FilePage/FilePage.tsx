/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { RouteComponentProps } from '@reach/router';
import { useEffect, useState } from 'react';
import { uploadFileToAzureBlob } from '../../services/AzureUpload';
import './FilePage.scss';
import { useManifestConnections } from '../../services/ManifestAPI';
import {
  FileUpload,
  FileUploadTemplate,
  ProgressLinear,
} from '@itwin/itwinui-react';
import { ManifestRunResponse } from '../../dto/Types';

export const FilePage = (props: RouteComponentProps) => {
  const [uploadedFileName, setUploadedFileName] = useState<string | null>();
  const [runState, setRunState] = useState<string | null>();
  const [
    fetchConnectionDefinitionId,
    runManifestConnectionDefinition,
    fetchRunResults,
  ] = useManifestConnections(uploadedFileName!);

  const fileUpload = async (fileList: FileList) => {
    // Upload file to azure blob storage
    setRunState('Uploading');
    const fileName: string | null = await uploadFileToAzureBlob(fileList[0]);
    setUploadedFileName(fileName);
  };

  const manifestConnectionRun = async (): Promise<void> => {
    // Create Manifest connection definition 
    setRunState('Creating connection if does not exist');
    const connectionDefinitionId = await fetchConnectionDefinitionId();

    // run manifest connection
    setRunState('Synchronizing connection');
    const runLocation: string | null = await runManifestConnectionDefinition(
      connectionDefinitionId!
    );

    // Get Manifest connection run results
    if (runLocation != null) {
      var interval = setInterval(async () => {
        const runResult: ManifestRunResponse = await fetchRunResults(
          runLocation
        );
        if (runResult.run!.state === 'Completed') {
          setRunState(runResult.run!.result);
          clearInterval(interval);
        }
      }, 60000);
    }
  };

  useEffect(() => {
    const runManifestConnection = async () => {
      if (uploadedFileName) {
        await manifestConnectionRun();
      }
    };

    runManifestConnection();
  }, [uploadedFileName]);

  return (
    <div className="file-page">
      {runState ? (
        <ProgressLinear
          labels={[runState]}
          indeterminate={runState === 'Success' || 'Error' ? true : undefined}
          status={
            runState === 'Success'
              ? 'positive'
              : runState === 'Error'
              ? 'negative'
              : undefined
          }
        />
      ) : (
        <FileUpload onFileDropped={fileUpload}>
          <FileUploadTemplate
            onChange={(e: any) => fileUpload(e.target.files)}
          />
        </FileUpload>
      )}
    </div>
  );
};
