/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { components } from '../dto/synchronization';

export type AuthorizationInformation =
  components['schemas']['AuthorizationInformation'];
export type ManifestConnection = components['schemas']['ManifestConnection'];
export type ManifestRunResponse =
  components['schemas']['manifest-run-response'];
export type ManifestFile = components['schemas']['ManifestFile'];
export type ManifestJob = components['schemas']['manifest-job'];
export type ManifestTask = components['schemas']['manifest-task'];
export type ManifestSourceFile = components['schemas']['manifest-source-file'];

export type RunResult = {
  state: string;
  runFileResults: RunFileResult[];
};
export type RunFileResult = ManifestTask & { connectorType?: string };

export type ExternalFile = {
  id: string;
  name: string;
  isFolder: boolean;
  modifiedDate: string;
  downloadUrl?: string;
};

export enum Status {
  Synchronized = 'Synchronized',
  Failed = 'Failed',
  Outdated = 'Outdated',
  Running = 'Running',
  NotSynchronized = 'Never synchronized',
}

export enum ConnectorType {
  AutoPlant = 'AUTOPLANT', // .dwg
  AvevaPid = 'AVEVAPID', //.dwg
  Civil = 'CIVIL', // .dgn
  Civil3D = 'CIVIL3D', // .dwg
  Dwg = 'DWG', //.dwg
  Geospatial = 'GEOSPATIAL', // .shp
  Ifc = 'IFC', //.ifc
  Microstation = 'MSTN', //.dgn
  Nwd = 'NWD', // .nwd .nwc
  OBD = 'OBD', // .dgn
  OpenTower = 'OPENTOWER', // .xml
  Revit = 'REVIT', //.rvt
  SPPID = 'SPPID', //.zip, .pid
  Vue = 'SPXREVIEW', //.vue
  AvevaDiagrams = 'AVEVADIAGRAMS', //.vsd
  ShellDWCSV = 'SHELLEDWCSV', // .cvs
  PSEXCEL = 'PSEXCEL',
  Prostructures = 'PROSTRUCTURES', // .dgn
  IntelliPid = 'INTELLIPID', // .json
}

export enum ModelFileExtension {
  Csv = 'csv',
  Dgn = 'dgn',
  Dwg = 'dwg',
  Dxf = 'dxf',
  Fbx = 'fbx',
  GeoDb = 'geodb',
  GeoJson = 'geojson',
  Idgn = 'i.dgn',
  Ifc = 'ifc',
  Json = 'json',
  Kml = 'kml',
  Nwc = 'nwc',
  Nwd = 'nwd',
  Obj = 'obj',
  OtXml = 'otxml',
  Pid = 'pid',
  Revit = 'rvt',
  Shp = 'shp',
  shpXml = 'shp.xml',
  Skp = 'skp',
  ThreeDm = '3dm',
  ThreeDs = '3ds',
  Vsd = 'vsd',
  Vue = 'vue',
  Xls = 'xls',
  Xlsx = 'xlsx',
  Xml = 'xml',
  Zip = 'zip',
}
