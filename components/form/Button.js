import React from 'react';

export const Button = ({type = "submit", name, label, onClick = null}) => {
    return (
        <button onClick={onClick} className="form-button" type={type} name={'action'}>{label}</button>
    );
}