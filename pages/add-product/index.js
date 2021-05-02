import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHttp } from '../../hooks/http.hook';
import { BlockContent } from '../../components/BlockContent';
import { Button, Field } from '../../components/form';
import { Snackbar } from '@material-ui/core';
import Head from 'next/head';

export default function AddProduct() {
    const { request } = useHttp();
    const { register, handleSubmit } = useForm();
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
        <>
            <Head>
                <title>Add product - Scanprices</title>
            </Head>
            <BlockContent>
                <Snackbar
                    open={open}
                    message={status}
                />

                <div className="header-2">Add product</div>
                <form className="form" onSubmit={(handleSubmit(addProduct))} noValidate autoComplete="off">
                    <Field>
                        <label htmlFor="url">Product url</label>
                        <input name="url" id="url" {...register('url', { required: true })} type="text" className="validate"/>
                    </Field>
                    <Button type="submit" label="Add" name="action"/>
                </form>
            </BlockContent>
        </>
    );
};