/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { UserManager } from 'oidc-client';
import { clientId } from '../env';
import { authority } from '../setup';

const scopes =
  'imodels:modify imodels:read synchronization:modify synchronization:read';

export const createUserManager = () => {
  return new UserManager({
    authority,
    client_id: clientId,
    redirect_uri: `${window.location.origin}/signin-oidc`,
    silent_redirect_uri: `${window.location.origin}/silent-signin-oidc`,
    automaticSilentRenew: true,
    response_type: 'code',
    query_status_response_type: 'code',
    scope: scopes,
    post_logout_redirect_uri: `${window.location.origin}/signout-oidc`,
  });
};
