import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Snackbar, LinearProgress } from '@material-ui/core';
import { useHttp } from '../hooks/http.hook';

export const AddGoodPage = () => {
    const { loading, request } = useHttp();
    const { register, handleSubmit, errors } = useForm();
    const [ status, setStatus ] = useState('');
    const [open, setOpen] = useState(false);

    const addGood = async (data) => {
        if (data.url) {
            try {
                try {
                    const fetched = await request(`/dev/scanprice/addgood/`, 'POST', data);
                    setStatus(fetched.message);
                } catch (e) {
                    setStatus(e.message);
                }
            } catch (e) {}
            setOpen(true);
        }
    };

    return (
        <>
            <LinearProgress style={{ opacity: loading ? 1 : 0 }} />
            <Snackbar
                open={open}
                message={status}
            />

            <div className="masonry row">
                <div className="col s12">
                    <h2>Add good</h2>
                    <form className={"addgood"} onSubmit={handleSubmit(addGood)} noValidate autoComplete="off">
                        <div className="row">
                            <div className="input-field col s6">
                                <input placeholder="Goood url" name="url" id="url" ref={register} type="text" className="validate"/>
                                <label htmlFor="first_name">Goood url</label>
                            </div>
                        </div>
                        <input type="submit"/>
                    </form>
                </div>
            </div>
        </>
    );
}