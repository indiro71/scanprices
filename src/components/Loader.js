import React from 'react';
import style from './loader.module.css';

export const Loader = () => {
    return (
        <div className={style.ldsRipple}>
            <div></div>
            <div></div>
        </div>
    );
}