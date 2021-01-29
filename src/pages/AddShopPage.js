import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LinearProgress, Snackbar } from '@material-ui/core';
import { useHttp } from '../hooks/http.hook';

export const AddShopPage = () => {
    const { loading, request } = useHttp();
    const { register, handleSubmit, errors } = useForm();
    const [ status, setStatus ] = useState('');
    const [ open, setOpen ] = useState(false);

    const addShop = async (data) => {
        if (data.url) {
            try {
                const fetched = await request(`/scanprices/shops/add/`, 'POST', data);
                setStatus(fetched.message);
            } catch (e) {
                setStatus(e.message);
            }
            setOpen(true);
        }
    };

    return (
        <>
            <LinearProgress style={{ opacity: loading ? 1 : 0 }}/>
            <Snackbar
                open={open}
                message={status}
            />

            <div className="masonry row">
                <div className="col s12">
                    <h2>Add shop</h2>
                    <form className={'addshop'} onSubmit={handleSubmit(addShop)} noValidate autoComplete="off">
                        <div className="row">
                            <div className="input-field col s6">
                                <label htmlFor="name">Shop name</label>
                                <input name="name" id="name" ref={register} type="text" className="validate"/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s6">
                                <label htmlFor="url">Shop url</label>
                                <input name="url" id="url" ref={register} type="text" className="validate"/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s6">
                                <label htmlFor="tagPrices">Price tags</label>
                                <input name="tagPrices" id="tagPrices" ref={register} type="text" className="validate"/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s6">
                                <label htmlFor="tagImage">Image tag</label>
                                <input name="tagImage" id="tagImage" ref={register} type="text" className="validate"/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s6">
                                <label htmlFor="tagName">Name tag</label>
                                <input name="tagName" id="tagName" ref={register} type="text" className="validate"/>
                            </div>
                        </div>
                        <button className="btn waves-effect waves-light" type="submit" name="action">Add
                            <i className="material-icons right"></i>
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}