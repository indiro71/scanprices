import React, { useState, useEffect, useCallback } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { BlockContent } from '../../components/BlockContent';
import { Button, Field } from '../../components/form';
import { useForm } from 'react-hook-form';
import { Snackbar } from '@material-ui/core';
import Head from 'next/head';

const DetailShopPage = ({shopId}) => {
    const { request } = useHttp();
    const [shop, setShop] = useState([]);
    const [status, setStatus] = useState('');
    const { register, handleSubmit, setValue } = useForm();
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
        <>
            <Head>
                <title>Shop {shop?.params?.name} - Scanprices</title>
            </Head>
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
                                <input name="name" id="name" {...register('name', { required: true })} type="text" className="validate"/>
                            </Field>
                            <Field>
                                <label htmlFor="url">Shop url</label>
                                <input name="url" id="url" {...register('url', { required: true })} type="text" className="validate"/>
                            </Field>
                            <Field>
                                <label htmlFor="tagPrices">Price tags</label>
                                <input name="tagPrices" id="tagPrices" {...register('tagPrices', { required: true })} type="text"
                                       className="validate"/>
                            </Field>
                            <Field>
                                <label htmlFor="tagImage">Image tag</label>
                                <input name="tagImage" id="tagImage" {...register('tagImage', { required: true })} type="text"
                                       className="validate"/>
                            </Field>
                            <Field>
                                <label htmlFor="tagName">Name tag</label>
                                <input name="tagName" id="tagName" {...register('tagName', { required: true })} type="text"
                                       className="validate"/>
                            </Field>
                            <Button type="submit" label="Edit" name="action"/>
                        </form>
                    </div>
                    : null}
            </BlockContent>
        </>
    );
};

export default DetailShopPage;

export const getServerSideProps = async ({params}) => {
    return {
        props: {
            shopId: params.id
        }
    }
}