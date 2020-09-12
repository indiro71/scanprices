import React from 'react';
import { NavLink } from 'react-router-dom';

function LeftMenu() {
    return (
        <ul id="slide-out" className="sidenav sidenav-fixed">
            <li>
                <NavLink activeClassName='white-text grey darken-1' className={'collapsible-header bold waves-effect'} to={'/goods'}>Goods</NavLink>
            </li>
            <li>
                <NavLink activeClassName='white-text grey darken-1' className={'collapsible-header bold waves-effect'} to={'/add-good'}>Add good</NavLink>
            </li>
            <li>
                <div className="divider"></div>
            </li>
            <li>
                <NavLink activeClassName='white-text grey darken-1' className={'collapsible-header bold waves-effect'} to={'/shops'}>Shops</NavLink>
            </li>
            <li>
                <NavLink activeClassName='white-text grey darken-1' className={'collapsible-header bold waves-effect'} to={'/add-shop'}>Add shop</NavLink>
            </li>
        </ul>


    );
}

export default LeftMenu;
