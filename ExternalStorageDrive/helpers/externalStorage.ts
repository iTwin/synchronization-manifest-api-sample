/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ContainerClient } from "@azure/storage-blob";
import { getAccessUrl, getMSAccessToken } from "./externalAccess";
import fetch from "node-fetch";

/*
 * Get items from Azure Storage
 */
export const getAzureStorageItems = async () => {
  const accessUrl = getAccessUrl("");
  const containerClient: ContainerClient = new ContainerClient(accessUrl);
  const azureFiles = [];

  for await (const blob of containerClient.listBlobsFlat()) {
    azureFiles.push({
      id:
        containerClient.accountName +
        "/" +
        containerClient.containerName +
        "/" +
        blob.name,
      isFolder: false,
      name: blob.name,
      modifiedDate: blob.properties.lastModified,
      downloadUrl: getAccessUrl(blob.name),
    });
  }

  return azureFiles;
};

/*
 * Get items from SharePoint Storage
 */
export const getSharePointStorageItems = async () => {
  const accessObject = await getMSAccessToken();

  const requestHeaders = {
    Authorization: "Bearer " + accessObject!.accessToken,
    "Content-Type": "application/json",
  };

  const drivesResponse = await fetch(
    "https://graph.microsoft.com/v1.0/drives",
    {
      method: "GET",
      headers: requestHeaders,
    }
  );

  const drives = await drivesResponse.json();

  const driveId = drives.value[0].id as string;

  const items = await fetch(
    `https://graph.microsoft.com/v1.0/drives/${driveId}/root/children`,
    {
      method: "GET",
      headers: requestHeaders,
    }
  );

  const result = await items.json();

  return result.value.map((item: any) => {
    return {
      id: item.id,
      name: item.name,
      isFolder: item.folder ? true : false,
      modifiedDate: item.lastModifiedDateTime,
      downloadUrl: item["@microsoft.graph.downloadUrl"],
    };
  });
};
