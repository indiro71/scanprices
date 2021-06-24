import React, { useState } from 'react';
import { Button } from '@indiro/library';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router'
import { useHttp } from '../../hooks/http.hook';
import { BlockContent } from '../../components/BlockContent';
import { Field } from '../../components/form';
import { Snackbar } from '@material-ui/core';
import { Loader } from '../../components/loader/Loader';
import currencyFormatter from 'currency-formatter';

export default function AddProduct() {
    const { request, loading } = useHttp();
    const { register, handleSubmit } = useForm();
    const [status, setStatus] = useState('');
    const [productData, setProductData] = useState();
    const [open, setOpen] = useState(false);
    const router = useRouter()

    const addProduct = async (data) => {
        if (productData) {
            try {
                const product = await request(`/scanprices/products/add/`, 'POST', { product: productData });
                if (data?.alertPrice) {
                    await request(`/scanprices/subscribe/`, 'POST',
                        {
                            price: data?.alertPrice,
                            good: product._id
                        });
                }
                router.push(`/products/${product._id}`);
            } catch (e) {
                setStatus(e.message);
                setOpen(true);
            }
        }
    };

    const scanProduct = async (data) => {
        if (data.url) {
            try {
                const productData = await request(`/scanprices/products/scan/`, 'POST', data);
                setProductData(productData);
            } catch (e) {
                setStatus(e.message);
                setOpen(true);
            }
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
                {loading && <Loader visible={true}/>}

                {!loading && !productData &&
                <form className="form" onSubmit={(handleSubmit(scanProduct))} noValidate autoComplete="off">
                    <Field>
                        <label htmlFor="url">Product url</label>
                        <input name="url" id="url" {...register('url', { required: true })} type="text"
                               className="validate"/>
                    </Field>
                    <Button type="submit" label="Scan" name="action"/>
                </form>
                }

                {!loading && productData &&
                    <form className="form" onSubmit={(handleSubmit(addProduct))} noValidate autoComplete="off">
                        <div className="flex w-full ">
                            <div className="flex w-1/4 mx-5 p-4 shadow-lg rounded-2xl bg-white items-center">
                                <img className="max-w-full" alt={productData.name}
                                     src={productData.image}/>
                            </div>

                            {productData.available ?
                                <div className="w-3/4 mx-5 p-4 shadow-lg rounded-2xl bg-white h-full">
                                    <div className="w-full flex mb-3">
                                        <b>Price: {currencyFormatter.format(productData.currentPrice, { code: 'RUB' })} </b>
                                    </div>

                                    <div className="w-full flex">
                                        <Field>
                                            <label htmlFor="alertPrice">Price for alert</label>
                                            <input name="alertPrice" id="alertPrice" {...register('alertPrice')} type="text" />
                                        </Field>
                                    </div>
                                </div>
                            :
                            <p><b>Not available</b></p>
                            }
                        </div>
                        <br/>
                        <Button type="submit" label="Add" name="action"/>
                    </form>
                }


            </BlockContent>
        </>
    );
}
;