# Sample Manifest API portal application

This is a sample application that demonstrates the usage of [Manifest Connection](https://developer.bentley.com/apis/synchronization/operations/get-manifest-connection/). This application implements file upload to Azure Blob Storage functionality and basic Manifest Connection operations with the presentational result.

## Setup

Please make sure to follow these steps for running this code sample application:

1.  Install npm on your machine.
1.  Install Node.js version [14.17.3](https://nodejs.org/en/blog/release/v14.17.3/).
1.  Clone this repository.
1.  `.env` file is required for setting up environmental variables used by the server application. Create `.env` file at `./api-manifest-sample/AccessTokenGenerator` and fill out required environmental variables.

    The file contents should contain:

    CONTAINER_NAME = <container name>                  // `CONTAINER_NAME` is your newly created container name inside Azure Blob storage, example: test
    CONNECTION_STRING = <connection string>            // `CONNECTION_STRING` is your Azure Storage account connection string, example: DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtl6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;

1.  `.env` file is required for setting up environmental variables used by a portal application. Create `.env` file at `./api-manifest-sample/Portal` and fill out required environmental variables.

    The file contents should contain:

    REACT_APP_PROJECT_ID = <Project ID>                // `REACT_APP_PROJECT_ID` is your created Project ID.
    REACT_APP_IMODEL_ID = <iModel ID>                  // `REACT_APP_IMODEL_ID` is your created iModel's ID created inside your Project with corresponding Project ID.
    REACT_APP_CLIENT_ID = <client ID>                  // `REACT_APP_CLIENT_ID` is your [registered application's](https://developer.bentley.com/my-apps/) Client ID. 
        
    Registered application's:

    * Scopes: `imodels:modify`, `imodels:read`, `synchronization:modify`, `synchronization:read`.
    * Redirect Urls: `http://localhost:3000/silent-signin-oidc`, `http://localhost:3000/signin-oidc`, `http://localhost:3000/`.
    * Post Logout Urls: `http://localhost:3000/signout-oidc`

1.  Open two terminal tabs.
1.  In first terminal tab navigate to `./api-manifest-sample/AccessTokenGenerator`.
1.  Run `npm install` to install the required dependencies.
1.  Run `npm build` to build the code.
1.  Run `npm start` to start the server.
1.  In the second terminal tab navigate to `./api-manifest-sample/Portal`.
1.  Run `npm install` to install the required dependencies.
1.  Run `npm start` to start the portal.
1.  Navigate to localhost:3000 (default port) in your browser.
## Code sample introduction

Code is documented to help the user understand how data is being used from each API call, how authorization workflow is implemented, what is the purpose of the main page and some other minor details.

[App.tsx](./Portal/src/App.tsx) contains a general navigation scheme.

[auth](./Portal/src/auth) folder contains all OAuth2 authorization workflow implementation.

[components](./Portal/src/components) folder contains most of application logic. Component namings are self-explanatory.

[services](./Portal/src/services) folder contains Azure file upload and Manifest API functionality. Refer to each for further explanations of each API call and how the data is used.

[index.ts](./AccessTokenGenerator/index.ts) contains all server logic needed for accessUrl retrieval.

## Introduction to application workflow

1.  Authenticate.
1.  Drag and drop the selected file or upload it the manual way.
1.  The loader with state information will be presented.
1.  When the selected file will be uploaded to Azure blob storage state will change from `Uploading` to `Creating connection`.
1.  When Manifest connection will be created the state will change from `Creating connection` to `Running connection`.
1.  When Manifest connection will complete the run the state will change from `Running connection` to `Success` or `Fail` depending on the result. (Runs take considerate time to complete)
1.  To upload a new file and repeat the workflow refresh the page.
