import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Snackbar } from '@material-ui/core';
import Head from 'next/head';
import { useHttp } from '../../hooks/http.hook';
import { BlockContent } from '../../components/BlockContent';
import { Button, Field } from '../../components/form';
import { Loader } from '../../components/loader/Loader';

export default function AddPair() {
  const { request, loading } = useHttp();
  const { register, handleSubmit } = useForm();
  const [status, setStatus] = useState('');
  const [open, setOpen] = useState(false);

  const addPair = async (data) => {
    if (data.symbol) {
      try {
        await request(`/scanprices/pairs/`, 'POST', data);
        setStatus('Pair added');
      } catch (e) {
        console.log(e);
      }
      setOpen(true);
    }
  };

  return (
    <>
      <Head>
        <title>Add new pair - Scanprices</title>
      </Head>
      <BlockContent>
        <Snackbar open={open} message={status} />

        <div className="header-2">Add pair</div>

        {loading ? (
          <Loader visible={true} />
        ) : (
          <form
            className="form"
            onSubmit={handleSubmit(addPair)}
            noValidate
            autoComplete="off"
          >
            <Field>
              <label htmlFor="name">Pair name</label>
              <input
                name="name"
                id="name"
                {...register('name', { required: true })}
                type="text"
                className="validate"
              />
            </Field>
            <Field>
              <label htmlFor="symbol">Pair symbol</label>
              <input
                name="symbol"
                id="symbol"
                {...register('symbol', { required: true })}
                type="text"
                className="validate"
              />
            </Field>
            <Field>
              <label htmlFor="contract">Pair contract</label>
              <input
                name="contract"
                id="contract"
                {...register('contract', { required: true })}
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
