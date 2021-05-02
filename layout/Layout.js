import LeftMenu from '../template/LeftMenu';
import { Layout } from '@indiro/layout';

import Link from 'next/link';

const project = () => {
    return (
        <Link href='/'><div className="cursor-pointer text-blue-600">Scanprices</div></Link>
    );
}

export const Layouts = ({children}) => {
    return (
        <div>
            <div>{children}</div>
        </div>
    );
}