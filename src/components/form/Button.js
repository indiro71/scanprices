import React from 'react';

export const Button = ({type = "submit", name, label}) => {
    return (
        <button className="form-button" type={type} name={'action'}>{label}</button>
    );
}