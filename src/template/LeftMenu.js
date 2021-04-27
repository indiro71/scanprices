import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function LeftMenu() {
    const [ filterMenu, setFilterMenu ] = useState([]);
    const auth = useContext(AuthContext);
    const menu = [
        {
            title: 'Auth',
            link: 'Auth',
            auth: false
        },
        {
            title: 'Products',
            link: '/products'
        },
        {
            title: 'Add product',
            link: '/add-product',
            auth: true
        },
        {
            title: 'Shops',
            link: '/shops'
        },
        {
            title: 'Add shop',
            link: '/add-shop',
            auth: true
        }
    ];

    useEffect(() => {
        if (auth.token) {
            setFilterMenu(menu.filter(item => item.auth !== false));
        } else {
            setFilterMenu(menu.filter(item => item.auth !== true));
        }
    }, [ auth.token ]);

    return (
        <div className="w-full">
            {filterMenu.map((item, index) => (
                    <NavLink
                        key={index}
                        activeClassName="text-gray-900 bg-gray-200 pointer-events-none left-active"
                        className="my-1 text-white px-4 py-3 w-full block rounded-l-full relative text-gray-100 hover:bg-blue-200 hover:bg-opacity-10"
                        to={item.link}>
                            <div className="left-active-top" />
                                {item.title}
                            <div className="left-active-bottom" />
                    </NavLink>
            ))}
        </div>
    );
}

export default LeftMenu;
