import React from 'react';
import Main from './components/Main';

import Router from 'react-router';
import routes from './config/routes';

let app = React.render(
  <Main />,
  document.getElementById('app')
);
