import React from 'react';
import classNames from 'classnames';
import style from './loader.module.css';

export const Loader = ({visible}) => {
    return (
        <div className={classNames(style.preloader, visible ? style.visible : '')}>
            <div className={style.prespinner}></div>
        </div>
    );
}