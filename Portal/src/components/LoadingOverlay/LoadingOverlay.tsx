/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Body, ProgressRadial } from '@itwin/itwinui-react';
import './loadingOverlay.scss';

interface LoadingOverlayProps {
  text?: string | null;
}

/*
 * LoadingOverlay is used to represent the progress radial spinner and a given text
 */
export const LoadingOverlay = (props: LoadingOverlayProps) => {
  const { text } = props;

  return (
    <div className="loading-overlay">
      <ProgressRadial indeterminate />
      {text && <Body className="progress-text">{text}</Body>}
    </div>
  );
};
