/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { BlobUtilities, createBlobService } from "azure-storage";

export const getAccessUrl = (fileName: string) => {
    const blobService = createBlobService(process.env.CONNECTION_STRING!);

    const startDate = new Date();
    startDate.setMinutes(startDate.getMinutes() - 5);
    const expiryDate = new Date(startDate);
    expiryDate.setMinutes(startDate.getMinutes() + 60);
    const permissions =
        BlobUtilities.SharedAccessPermissions.READ +
        BlobUtilities.SharedAccessPermissions.WRITE +
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

    return blobService.getUrl(
        process.env.CONTAINER_NAME!,
        fileName,
        sasToken
    );
};
