import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Layout } from '@indiro/layout';
import { AuthContext } from './context/AuthContext';
import { useRoutes } from './routes';
import { useAuth } from './hooks/auth.hook';
import LeftMenu from './template/LeftMenu';
import LinearProgress from '@material-ui/core/LinearProgress';

function App() {
    const { token, login, logout, ready } = useAuth();
    const isAuthenticated = !!token;
    const routes = useRoutes(isAuthenticated);

    if (!ready) {
        return <LinearProgress/>;
    }

    return (
        <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
            <Router>
                <Layout content={routes} leftMenuItems={LeftMenu}/>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;
