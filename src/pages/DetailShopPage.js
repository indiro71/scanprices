import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { Snackbar } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { BlockContent } from '../components/BlockContent';
import { Button, Field } from '../components/form';

export const DetailShopPage = () => {
    const { request } = useHttp();
    const [shop, setShop] = useState([]);
    const shopId = useParams().id;
    const [status, setStatus] = useState('');
    const { register: editShopForm, handleSubmit, setValue } = useForm();
    const [open, setOpen] = useState(false);

    const fetchShop = useCallback(async () => {
        try {
            const fetched = await request(`/scanprices/shops/item/${shopId}`, 'GET');
            setShop(fetched.data);
            setValue('name', fetched.data.params.name);
            setValue('url', fetched.data.params.url);
            setValue('tagPrices', fetched.data.params.tagPrices.join(', '));
            setValue('tagImage', fetched.data.params.tagImage);
            setValue('tagName', fetched.data.params.tagName);
        } catch (e) {
        }
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

    useEffect(() => {
        fetchShop();
    }, [fetchShop]);

    return (
        <BlockContent>
            <Snackbar
                open={open}
                message={status}
            />
            {shop.params ?
                <div>
                    <div className="header-2">{shop.params.name}</div>

                    <form className="form" onSubmit={handleSubmit(editShop)} noValidate
                          autoComplete="off">
                        <Field>
                            <label htmlFor="name">Shop name</label>
                            <input name="name" id="name" ref={editShopForm} type="text" className="validate"/>
                        </Field>
                        <Field>
                            <label htmlFor="url">Shop url</label>
                            <input name="url" id="url" ref={editShopForm} type="text" className="validate"/>
                        </Field>
                        <Field>
                            <label htmlFor="tagPrices">Price tags</label>
                            <input name="tagPrices" id="tagPrices" ref={editShopForm} type="text"
                                   className="validate"/>
                        </Field>
                        <Field>
                            <label htmlFor="tagImage">Image tag</label>
                            <input name="tagImage" id="tagImage" ref={editShopForm} type="text"
                                   className="validate"/>
                        </Field>
                        <Field>
                            <label htmlFor="tagName">Name tag</label>
                            <input name="tagName" id="tagName" ref={editShopForm} type="text"
                                   className="validate"/>
                        </Field>
                        <Button type="submit" label="Edit" name="action"/>
                    </form>
                </div>
                : null}
        </BlockContent>
    );
};