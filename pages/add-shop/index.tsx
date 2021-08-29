import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHttp } from '../../hooks/http.hook';
import { BlockContent } from '../../components/BlockContent';
import { Button, Field } from '../../components/form';
import { Snackbar } from '@material-ui/core';
import Head from 'next/head';
import { Loader } from '../../components/loader/Loader';

export default function AddShop() {
  const { request, loading } = useHttp();
  const { register, handleSubmit } = useForm();
  const [status, setStatus] = useState('');
  const [open, setOpen] = useState(false);

  const addShop = async (data) => {
    if (data.url) {
      try {
        await request(`/scanprices/shops/`, 'POST', data);
        setStatus('Shop added');
      } catch (e) {
        console.log(e);
      }
      setOpen(true);
    }
  };

  return (
    <>
      <Head>
        <title>Add new shop - Scanprices</title>
      </Head>
      <BlockContent>
        <Snackbar open={open} message={status} />

        <div className="header-2">Add shop</div>

        {loading ? (
          <Loader visible={true} />
        ) : (
          <form
            className="form"
            onSubmit={handleSubmit(addShop)}
            noValidate
            autoComplete="off"
          >
            <Field>
              <label htmlFor="name">Shop name</label>
              <input
                name="name"
                id="name"
                {...register('name', { required: true })}
                type="text"
                className="validate"
              />
            </Field>
            <Field>
              <label htmlFor="url">Shop url</label>
              <input
                name="url"
                id="url"
                {...register('url', { required: true })}
                type="text"
                className="validate"
              />
            </Field>
            <Field>
              <label htmlFor="tagPrices">Price tags</label>
              <input
                name="tagPrices"
                id="tagPrices"
                {...register('tagPrices', { required: true })}
                type="text"
                className="validate"
              />
            </Field>
            <Field>
              <label htmlFor="tagImage">Image tag</label>
              <input
                name="tagImage"
                id="tagImage"
                {...register('tagImage', { required: true })}
                type="text"
                className="validate"
              />
            </Field>
            <Field>
              <label htmlFor="tagName">Name tag</label>
              <input
                name="tagName"
                id="tagName"
                {...register('tagName', { required: true })}
                type="text"
                className="validate"
              />
            </Field>
            <Button type="submit" label="Add" name="action" />
          </form>
        )}
      </BlockContent>
    </>
  );
}
