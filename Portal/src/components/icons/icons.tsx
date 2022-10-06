/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import React from 'react';
import cx from 'classnames';
import './icon.css';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color?: 'default' | 'primary' | 'positive' | 'warning' | 'negative';
}

/*
 * Component to format icons
 */
export const Icon = (props: IconProps): JSX.Element => {
  const { icon: Icon, color, className, ...rest } = props;
  return (
    <Icon
      className={cx(className, `icon-size-default`, {
        [`icon-${color}`]: color,
      })}
      {...rest}
    />
  );
};
