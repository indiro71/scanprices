import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Snackbar } from '@material-ui/core';
import { useHttp } from '../hooks/http.hook';
import { BlockContent } from '../components/BlockContent';
import { Button, Field } from '../components/form';

export const AddProductPage = () => {
    const { request } = useHttp();
    const { register, handleSubmit, errors } = useForm();
    const [status, setStatus] = useState('');
    const [open, setOpen] = useState(false);

    const addProduct = async (data) => {
        if (data.url) {
            try {
                const fetched = await request(`/scanprices/products/add/`, 'POST', data);
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

            <div className="header-2">Add product</div>
            <form className="form" onSubmit={handleSubmit(addProduct)} noValidate autoComplete="off">
                <Field>
                    <label htmlFor="url">Product url</label>
                    <input name="url" id="url" ref={register} type="text" className="validate"/>
                </Field>
                <Button type="submit" label="Add" name="action"/>
            </form>
        </BlockContent>
    );
};