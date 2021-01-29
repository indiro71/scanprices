import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Snackbar, LinearProgress } from '@material-ui/core';
import { useHttp } from '../hooks/http.hook';

export const AddProductPage = () => {
    const { loading, request } = useHttp();
    const { register, handleSubmit, errors } = useForm();
    const [ status, setStatus ] = useState('');
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
            <LinearProgress style={{ opacity: loading ? 1 : 0 }} />
            <Snackbar
                open={open}
                message={status}
            />

            <div className="masonry row">
                <div className="col s12">
                    <h2>Add product</h2>
                    <form className={"addproduct"} onSubmit={handleSubmit(addProduct)} noValidate autoComplete="off">
                        <div className="row">
                            <div className="input-field col s6">
                                <label htmlFor="url">Product url</label>
                                <input  name="url" id="url" ref={register} type="text" className="validate"/>
                            </div>
                        </div>
                        <button className="btn waves-effect waves-light" type="submit" name="action">Add
                            <i className="material-icons right"></i>
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}