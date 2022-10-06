/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  SvgStatusWarning,
  SvgStatusSuccess,
  SvgStatusRunning,
  SvgStatusError,
} from '@itwin/itwinui-icons-react';
import { Body } from '@itwin/itwinui-react';
import { Status } from '../../typedef/types';
import { formatDate } from '../../helpers/formatters';
import { Icon } from '../icons/icons';

/*
 * Data for the first table from External files
 */
export const firstTableColumns = () => [
  {
    Header: 'Table',
    columns: [
      {
        id: 'name',
        Header: 'Name',
        minWidth: 50,
        Cell: ({ row: { original } }: any) => {
          return <Body>{original.name}</Body>;
        },
      },
      {
        id: 'modifiedDate',
        Header: 'Modified date',
        minWidth: 50,
        Cell: ({ row: { original } }: any) => {
          const modifiedDate = formatDate(original.modifiedDate);
          return <Body>{modifiedDate}</Body>;
        },
      },
    ],
  },
];

/*
 * Data for the second table from Run results
 */
export const secondTableColumns = () => [
  {
    Header: 'Table',
    columns: [
      {
        id: 'name',
        Header: 'Name',
        minWidth: 50,
        Cell: ({ row: { original } }: any) => {
          return <Body>{original.name}</Body>;
        },
      },
      {
        id: 'connector',
        Header: 'Connector',
        minWidth: 50,
        Cell: ({ row: { original } }: any) => {
          return <Body>{original.connectorType}</Body>;
        },
      },
      {
        id: 'state',
        Header: 'State',
        minWidth: 50,
        Cell: ({ row: { original } }: any) => {
          return (
            <Body>
              {original.state === Status.NotSynchronized ? (
                <Icon
                  icon={SvgStatusWarning}
                  color="warning"
                  className="status-icon"
                />
              ) : original.state === Status.Outdated ? (
                <Icon
                  icon={SvgStatusWarning}
                  color="warning"
                  className="status-icon"
                />
              ) : original.state === Status.Synchronized ? (
                <Icon
                  icon={SvgStatusSuccess}
                  color="positive"
                  className="status-icon"
                />
              ) : original.state === Status.Running ? (
                <Icon
                  icon={SvgStatusRunning}
                  color="primary"
                  className="status-icon"
                />
              ) : (
                <Icon
                  icon={SvgStatusError}
                  color="negative"
                  className="status-icon"
                />
              )}
              {original.state}
            </Body>
          );
        },
      },
      {
        id: 'synchronizedDate',
        Header: 'Last sync',
        minWidth: 50,
        Cell: ({ row: { original } }: any) => {
          return <Body>{original.synchronizedDate}</Body>;
        },
      },
    ],
  },
];
