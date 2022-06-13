/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
//for test purpose
import { RouteComponentProps } from '@reach/router';
import { useEffect, useState } from 'react';
import {
  uploadFileToAzureBlob,
} from '../../services/AzureUpload';
import './FilePage.scss';
import {
  useManifestConnections,
} from '../../services/ManifestAPI';
import { ManifestRunResponse } from '../../dto/Types';
import { FileUpload, FileUploadTemplate, ProgressLinear } from '@itwin/itwinui-react';

export const FilePage = (props: RouteComponentProps) => {
  const [uploadedFileName, setUploadedFileName] = useState<string | null>();
  const [runState, setRunState] = useState<string | null>();
  const [createManifestConnectionDefinition, runManifestConnectionDefinition, fetchRunResults] = useManifestConnections();

  const fileUpload = async (fileList: FileList) => {
    // Upload file to azure blob storage
    setRunState("Uploading");
    const fileName: string | null = await uploadFileToAzureBlob(fileList[0]);
    setUploadedFileName(fileName);
  };

  const manifestConnectionRun = async () => {
    // Create Manifest connection definition
    setRunState("Creating connection");
    const createResponse = await createManifestConnectionDefinition();

    // Run Manifest connection
    setRunState("Running connection");
    const runLocation: string | null = await runManifestConnectionDefinition(createResponse.id!, uploadedFileName!);

    // Get Manifest connection run results
    if (runLocation) {
      var interval = setInterval(async () => {
        const runResult: ManifestRunResponse = await fetchRunResults(runLocation);
        if (runResult.run!.state === "Completed") {
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
      {runState ?
        <ProgressLinear
          labels={[runState]}
          indeterminate={runState === 'Success' || 'Error' ? true : undefined}
          status={runState === 'Success' ? 'positive' : runState === 'Error' ? 'negative' : undefined}
        />
        :
        <FileUpload
          onFileDropped={fileUpload}
        >
          <FileUploadTemplate onChange={(e: any) => fileUpload(e.target.files)} />
        </FileUpload>
      }
    </div>
  );
};
