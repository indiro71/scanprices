import React from 'react';
import { BrowserRouter as Router, NavLink } from 'react-router-dom';
import { Layout } from '@indiro/layout';
import { AuthContext } from './context/AuthContext';
import { useRoutes } from './routes';
import { useAuth } from './hooks/auth.hook';
import LeftMenu from './template/LeftMenu';
import LinearProgress from '@material-ui/core/LinearProgress';

const project = () => {
    return (
        <NavLink className="cursor-pointer text-blue-600" to='/'>Scanprices</NavLink>
    );
}

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
                <Layout content={routes} leftMenuItems={LeftMenu} project={project}/>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;
