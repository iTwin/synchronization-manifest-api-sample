/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import './App.scss';
import { iModelId, clientId } from './env';
import { useAuthContext } from './auth/AuthContext';
import { CompleteSignIn } from './auth/CompleteSignIn';
import { Login } from './auth/Login';
import { LocationProvider, Router } from '@reach/router';
import { SynchronizationPage } from './components/synchronizationPage/synchronizationPage';
import { SynchronizationAuthWrapper } from './auth/SynchronizationAuthWrapper';
import { Layout } from './components/layout/layout';

const App = (): JSX.Element => {
  const { user } = useAuthContext();

  return iModelId && clientId ? (
    <LocationProvider>
      <Layout>
        <Router>
          <CompleteSignIn path="/signin-oidc" />
          {user === null || user.expired ? (
            <Login path="/*" />
          ) : (
            <SynchronizationAuthWrapper path="/" user={user}>
              <SynchronizationPage path="/" />
            </SynchronizationAuthWrapper>
          )}
        </Router>
      </Layout>
    </LocationProvider>
  ) : (
    <div>Application is not configured.</div>
  );
};

export default App;
