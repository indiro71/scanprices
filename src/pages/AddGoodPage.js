import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Snackbar, LinearProgress } from '@material-ui/core';
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
                                <label htmlFor="url">Good url</label>
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