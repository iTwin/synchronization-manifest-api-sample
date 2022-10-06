/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import './app.scss';
import { projectId, iModelId, clientId } from './env';
import { useAuthContext } from './auth/authContext';
import { CompleteSignIn } from './auth/completeSignIn';
import { Login } from './auth/login';
import { LocationProvider, Router } from '@reach/router';
import { SynchronizationPage } from './components/synchronizationPage/synchronizationPage';
import { SynchronizationAuthWrapper } from './auth/synchronizationAuthWrapper';
import { Layout } from './components/layout/layout';

const App = (): JSX.Element => {
  const { user } = useAuthContext();

  return projectId && iModelId && clientId ? (
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
