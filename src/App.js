import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from '@indiro/layout';
import { useRoutes } from './routes';
import LeftMenu  from './template/LeftMenu';

function App() {
  const routes = useRoutes();
  return (
      <Router>
        <Layout content={routes} leftMenu={LeftMenu}/>
      </Router>
  );
}

export default App;
