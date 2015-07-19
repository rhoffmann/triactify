// react
import React from 'react';
import Router from 'react-router';

let DefaultRoute = Router.DefaultRoute;
let Route = Router.Route;

// components
import Main from '../components/Main';
import TriactifyDemo from '../components/TriactifyDemo';

let routes = (
  <Route name="app" path="/" handler={Main}>
    <Route name="palette" path="/p/:palette" handler={TriactifyDemo} />
    <DefaultRoute handler={TriactifyDemo} />
  </Route>
);

export default routes;
