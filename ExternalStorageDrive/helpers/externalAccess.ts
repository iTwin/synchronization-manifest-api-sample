/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ConfidentialClientApplication, Configuration } from "@azure/msal-node";
import { BlobUtilities, createBlobService } from "azure-storage";

/*
 * Get Microsoft Access Token for Microsoft SharePoint storage
 */
export const getMSAccessToken = async () => {
  const msalConfig: Configuration = {
    auth: {
      clientId: process.env.CLIENT_ID!,
      authority: process.env.AAD_ENDPOINT + process.env.TENANT_ID!,
      clientSecret: process.env.CLIENT_SECRET,
    },
  };

  const confidentialClientApplication = new ConfidentialClientApplication(
    msalConfig
  );

  const tokenRequest = {
    scopes: [process.env.GRAPH_ENDPOINT + ".default"],
  };

  return await confidentialClientApplication.acquireTokenByClientCredential(
    tokenRequest
  );
};

/*
 * Get Access Url for Azure blob storage
 */
export const getAccessUrl = (fileName: string) => {
  const blobService = createBlobService(process.env.CONNECTION_STRING!);

  const startDate = new Date();
  startDate.setMinutes(startDate.getMinutes() - 5);
  const expiryDate = new Date(startDate);
  expiryDate.setMinutes(startDate.getMinutes() + 60);
  const permissions =
    BlobUtilities.SharedAccessPermissions.READ +
    BlobUtilities.SharedAccessPermissions.LIST;

  const sharedAccessPolicy = {
    AccessPolicy: {
      Permissions: permissions,
      Start: startDate,
      Expiry: expiryDate,
    },
  };

  const sasToken = blobService.generateSharedAccessSignature(
    process.env.CONTAINER_NAME!,
    fileName,
    sharedAccessPolicy
  );

  return blobService.getUrl(process.env.CONTAINER_NAME!, fileName, sasToken);
};
