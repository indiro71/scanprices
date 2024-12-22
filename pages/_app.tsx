import Link from 'next/link';
import { LayoutComponent } from '@indiro/layout';
import LeftMenu from '../template/LeftMenu';
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
  const getLayout =
    Component.getLayout ??
    ((page) => (
      <LayoutComponent leftMenuItems={LeftMenu} project={project}>
        {page}
      </LayoutComponent>
    ));

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {getLayout(<Component {...pageProps} />)}
    </AuthContext.Provider>
  );
}

export default MyApp;
