import React from 'react';
import Router from 'react-router';

import routes from './config/routes';

export default Router.run(routes, (Root) => {
  React.render(
    <Root />,
    document.getElementById('app')
  );
});
