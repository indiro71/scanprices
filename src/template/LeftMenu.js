import React from 'react';
import { Link } from 'react-router-dom';
import { DeveloperMode } from '@material-ui/icons';

function LeftMenu() {
    return (
        <ul id="sidenav-left" className="sidenav sidenav-fixed">
            <li><a href="/" className="logo-container">Admin<i
                className="material-icons left"><DeveloperMode/></i></a></li>
            <li className="no-padding">
                <ul className="collapsible collapsible-accordion">
                    <li className="bold waves-effect">
                        <Link className={'collapsible-header'} to={'/goods'}>Goods</Link>
                    </li>
                    <li className="bold waves-effect">
                        <Link className={'collapsible-header'} to={'/add-good'}>Add good</Link>
                    </li>
                    <li className="bold waves-effect">
                        <Link className={'collapsible-header'} to={'/add-shop'}>Add shop</Link>
                    </li>
                </ul>
            </li>
        </ul>
    );
}

export default LeftMenu;
