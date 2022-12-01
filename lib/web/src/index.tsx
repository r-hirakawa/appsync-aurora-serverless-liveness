import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import { Amplify } from 'aws-amplify';
import { App } from './App';

Amplify.configure({
  aws_project_region: process.env.REACT_APP_AWS_REGION,
  aws_appsync_graphqlEndpoint: process.env.REACT_APP_AWS_APPSYNC_ENDPOINT,
  aws_appsync_region: process.env.REACT_APP_AWS_REGION,
  aws_appsync_authenticationType: process.env.REACT_APP_AWS_APPSYNC_AUTHTYPE,
  aws_appsync_apiKey: process.env.REACT_APP_AWS_APPSYNC_API_KEY,
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <CssBaseline />
    <App />
  </React.StrictMode>,
);
