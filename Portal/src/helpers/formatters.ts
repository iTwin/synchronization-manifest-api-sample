/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { RunFileResult, ExternalFile, Status } from '../typedef/types';

export const setRunStatusLabel = (label: string) => {
  switch (label) {
    case 'NotStarted':
    case 'WaitingToExecute':
      return 'Starting';
    default:
      return label;
  }
};

export const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(date));
};

export const getSynchronizedDate = (task: RunFileResult | undefined) => {
  return task
    ? task.result === 'Undetermined'
      ? ''
      : formatDate(task.endDateTime + 'Z')
    : '';
};

export const getFileState = (
  task: RunFileResult | undefined,
  file: ExternalFile
) => {
  return task
    ? task.result === 'Undetermined'
      ? Status.Running
      : task.result === 'Error'
      ? Status.Failed
      : new Date(file.modifiedDate) > new Date(getSynchronizedDate(task))
      ? Status.Outdated
      : Status.Synchronized
    : Status.NotSynchronized;
};
