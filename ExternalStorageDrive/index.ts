/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import express from "express";
import * as dotenv from "dotenv";
import {
  getAzureStorageItems,
  getSharePointStorageItems,
} from "./helpers/externalStorage";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// Get External storage files depending on the setup
app.get("/getExternalStorageFiles", async (req, res) => {
  switch (process.env.STORAGE_TYPE) {
    case "Azure":
      res.json(await getAzureStorageItems());
      break;
    case "SharePoint":
      res.json(await getSharePointStorageItems());
      break;
    default:
      console.log("Define Storage type");
      break;
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
