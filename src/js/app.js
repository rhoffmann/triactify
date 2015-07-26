import React from 'react';
import Router from 'react-router';

import routes from './config/routes';

export default Router.run(routes, Router.HashLocation, (Root) => {
  React.render(
    <Root />,
    document.getElementById('app')
  );
});
