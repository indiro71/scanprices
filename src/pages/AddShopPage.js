import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Snackbar } from '@material-ui/core';
import { useHttp } from '../hooks/http.hook';
import { BlockContent } from '../components/BlockContent';
import { Button, Field } from '../components/form';

export const AddShopPage = () => {
    const { request } = useHttp();
    const { register, handleSubmit } = useForm();
    const [status, setStatus] = useState('');
    const [open, setOpen] = useState(false);

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
        <BlockContent>
            <Snackbar
                open={open}
                message={status}
            />

            <div className="header-2">Add shop</div>

            <form className="form" onSubmit={handleSubmit(addShop)} noValidate autoComplete="off">
                <Field>
                    <label htmlFor="name">Shop name</label>
                    <input name="name" id="name" ref={register} type="text" className="validate"/>
                </Field>
                <Field>
                    <label htmlFor="url">Shop url</label>
                    <input name="url" id="url" ref={register} type="text" className="validate"/>
                </Field>
                <Field>
                    <label htmlFor="tagPrices">Price tags</label>
                    <input name="tagPrices" id="tagPrices" ref={register} type="text" className="validate"/>
                </Field>
                <Field>
                    <label htmlFor="tagImage">Image tag</label>
                    <input name="tagImage" id="tagImage" ref={register} type="text" className="validate"/>
                </Field>
                <Field>
                    <label htmlFor="tagName">Name tag</label>
                    <input name="tagName" id="tagName" ref={register} type="text" className="validate"/>
                </Field>
                <Button type="submit" label="Add" name="action"/>
            </form>
        </BlockContent>
    );
};