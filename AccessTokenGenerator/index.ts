/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import express from "express";
import * as dotenv from "dotenv";
import { getAccessUrl } from "./helpers/accessUrl";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.get("/getFolderAccessUrl", async (req, res) => {
  const accessUrl = getAccessUrl('');
  res.json({ accessUrl: accessUrl });
});

app.get("/getFileAccessUrl", async (req, res) => {
  const fileName = req.query.fileName as string;
  const accessUrl = getAccessUrl(fileName);
  res.json({ accessUrl: accessUrl });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
