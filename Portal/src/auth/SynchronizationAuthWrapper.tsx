/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { RouteComponentProps } from '@reach/router';
import { User } from 'oidc-client';
import { useEffect, useState } from 'react';
import { LoadingOverlay } from '../components/LoadingOverlay/LoadingOverlay';
import { AuthorizationInformation } from '../dto/Types';
import { apiDomain } from '../setup';

export interface SynchronizationAuthWrapperProps {
  user: User;
  children: React.ReactNode;
}

export const SynchronizationAuthWrapper = (
  props: RouteComponentProps & SynchronizationAuthWrapperProps
) => {
  const { user, children } = props;
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const authorizeAsync = async () => {
      const requestHeaders = {
        Authorization: `Bearer ${user.access_token}`,
      };

      const authInfo: AuthorizationInformation = await (
        await fetch(
          `${apiDomain}/synchronization/imodels/connections/authorizationInformation?redirectUrl=${window.location.href}`,
          { headers: requestHeaders }
        )
      ).json();
      if (!authInfo.isUserAuthorized && authInfo._links && authInfo._links.authorizationUrl) {
        const authRedirectUrl =
          authInfo._links.authorizationUrl.href;
        window.open(authRedirectUrl!);
      } else {
        setIsAuthorized(true);
      }
    };

    authorizeAsync();
  }, [user]);

  return (
    <>
      {isAuthorized ? (
        children
      ) : (
        <LoadingOverlay text="Authorizing for synchronization" />
      )}
    </>
  );
};
