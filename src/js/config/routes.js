import React from 'react';
import { Router, Route, DefaultRoute} from 'react-router';

import Main from '../components/Main';
import TriactifyDemo from '../components/TriactifyDemo';

export default (
  <Route name="app" path="/" handler={Main}>
    <Route name="setup" path="/:setup" handler={TriactifyDemo} />
    <DefaultRoute handler={TriactifyDemo} />
  </Route>
);
