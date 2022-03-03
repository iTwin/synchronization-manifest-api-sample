/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import './App.scss';
import { projectId, iModelId, clientId } from './env';
import { useAuthContext } from './auth/AuthContext';
import { CompleteSignIn } from './auth/CompleteSignIn';
import { Login } from './auth/Login';
import { LocationProvider, Router } from '@reach/router';
import { FilePage } from './components/FilePage/FilePage';
import { SynchronizationAuthWrapper } from './auth/SynchronizationAuthWrapper';

const App = (): JSX.Element => {
  const { user } = useAuthContext();

  return (
    projectId && iModelId && clientId ? (
      <LocationProvider>
        <Router>
          <CompleteSignIn path="/signin-oidc" />
          {user === null || user.expired ? (
            <Login path="/*" />
          ) : (
            <SynchronizationAuthWrapper path="/" user={user}>
              <FilePage path="/" />
            </SynchronizationAuthWrapper>
          )}
        </Router>
      </LocationProvider>
    ) : (<div>Application is not configured.</div>)
  )
};

export default App;
