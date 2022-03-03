import { components } from './Synchronization';

export type AuthorizationInformation = components['schemas']['AuthorizationInformation'];
export type ManifestConnection = components['schemas']['ManifestConnection'];
export type ManifestRunResponse = components['schemas']['manifest-run-response'];

export type FileAccessObject = {
    accessUrl: string;
}

export type FolderAccessObject = {
    accessUrl: string;
}