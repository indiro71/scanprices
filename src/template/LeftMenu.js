import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function LeftMenu() {
    const [ filterMenu, setFilterMenu ] = useState([]);
    const auth = useContext(AuthContext);
    const menu = [
        {
            title: 'Main',
            link: '/'
        },
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
        <ul id="slide-out" className="sidenav sidenav-fixed">
            {filterMenu.map(item => (
                <li>
                    <NavLink className={'bold waves-effect'} to={item.link}>{item.title}</NavLink>
                </li>
            ))}
        </ul>
    );
}

export default LeftMenu;
