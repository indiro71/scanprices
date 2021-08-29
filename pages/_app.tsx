import Link from 'next/link';
import LeftMenu from '../template/LeftMenu';
import { LayoutComponent } from '@indiro/layout';
import { AuthContext } from '../context/AuthContext';
import { useAuth } from '../hooks/auth.hook';
import '@indiro/layout/dist/index.css';
import '@indiro/library/dist/index.css';
import '../styles/globals.css';

const project = () => {
  return (
    <Link href="/">
      <div className="cursor-pointer text-blue-600">Scanprices</div>
    </Link>
  );
};

function MyApp({ Component, pageProps }): JSX.Element {
  const { token, login, logout } = useAuth();
  const isAuthenticated = !!token;
  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      <LayoutComponent leftMenuItems={LeftMenu} project={project}>
        <Component {...pageProps} />
      </LayoutComponent>
    </AuthContext.Provider>
  );
}

export default MyApp;
