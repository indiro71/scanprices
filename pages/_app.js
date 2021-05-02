import '../styles/globals.css'
import Link from 'next/link';
import { AuthContext } from '../context/AuthContext';
import { useAuth } from '../hooks/auth.hook';
import LeftMenu from '../template/LeftMenu';
import { LayoutComponent } from '@indiro/layout';
import '@indiro/layout/dist/index.css';


const project = () => {
    return (
        <Link href='/'><div className="cursor-pointer text-blue-600">Scanprices</div></Link>
    );
}

function MyApp({ Component, pageProps }) {
    const { token, login, logout, ready } = useAuth();
    const isAuthenticated = !!token;
  return (
      <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
              <LayoutComponent leftMenuItems={LeftMenu} project={project}>
                  <Component {...pageProps} />
              </LayoutComponent>
      </AuthContext.Provider>
  );
}

export default MyApp
