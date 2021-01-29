import React, { useCallback, useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { LinearProgress, Snackbar } from '@material-ui/core';
import { useForm } from 'react-hook-form';

export const DetailShopPage = () => {
    const { loading, request } = useHttp();
    const [ shop, setShop ] = useState([]);
    const shopId = useParams().id;
    const [ status, setStatus ] = useState('');
    const { register: editShopForm, handleSubmit, setValue } = useForm();
    const [ open, setOpen ] = useState(false);

    const fetchShop = useCallback(async () => {
        try {
            const fetched = await request(`/scanprices/shops/item/${shopId}`, 'GET');
            setShop(fetched.data);
            setValue('name', fetched.data.params.name);
            setValue('url', fetched.data.params.url);
            setValue('tagPrices', fetched.data.params.tagPrices.join(', '));
            setValue('tagImage', fetched.data.params.tagImage);
            setValue('tagName', fetched.data.params.tagName);
        } catch (e) {}
    }, [shopId, request]);

    const editShop = async (data) => {
        if (data.name) {
            try {
                const fetched = await request(`/scanprices/shops/edit/${shopId}`, 'PUT', data);
                setStatus(fetched.message);
            } catch (e) {
                setStatus(e.message);
            }
            setOpen(true);
        }
    };

    useEffect( () => {
        fetchShop();
    }, [fetchShop]);

    return (
        <>
            <LinearProgress style={{ opacity: loading ? 1 : 0 }}/>
            <Snackbar
                open={open}
                message={status}
            />
            {shop.params ?
                <div className="masonry row">
                    <div className="col s12">
                        <h2>{shop.params.name}</h2>
                        <form className={'editShop'} onSubmit={handleSubmit(editShop)} noValidate autoComplete="off">
                            <div className="row">
                                <div className="input-field col s6">
                                    <label htmlFor="name">Shop name</label>
                                    <input name="name" id="name" ref={editShopForm} type="text" className="validate"/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s6">
                                    <label htmlFor="url">Shop url</label>
                                    <input name="url" id="url" ref={editShopForm} type="text" className="validate"/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s6">
                                    <label htmlFor="tagPrices">Price tags</label>
                                    <input name="tagPrices" id="tagPrices" ref={editShopForm} type="text"
                                           className="validate"/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s6">
                                    <label htmlFor="tagImage">Image tag</label>
                                    <input name="tagImage" id="tagImage" ref={editShopForm} type="text"
                                           className="validate"/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s6">
                                    <label htmlFor="tagName">Name tag</label>
                                    <input name="tagName" id="tagName" ref={editShopForm} type="text" className="validate"/>
                                </div>
                            </div>
                            <button className="btn waves-effect waves-light" type="submit" name="action">Edit
                                <i className="material-icons right"></i>
                            </button>
                        </form>
                    </div>
                </div>
            : null}
        </>
    );
}