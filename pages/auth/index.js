import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useHttp } from '../../hooks/http.hook';
import { BlockContent } from '../../components/BlockContent';
import { Button, Field } from '../../components/form';
import { Snackbar } from '@material-ui/core';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { AuthContext } from '../../context/AuthContext';
import Head from 'next/head';

export default function AuhPage() {
    const auth = useContext(AuthContext);
    const { request } = useHttp();
    const { register: login, handleSubmit: handleLogin } = useForm();
    const { register: register, handleSubmit: handleRegister } = useForm();
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState('');

    const registerHandler = async (data) => {
        try {
            const fetched = await request('/auth/register/', 'POST', { ...data });
            setStatus(fetched.message);
            setOpen(true);
        } catch (e) {
        }
    };

    const loginHandler = async (data) => {
        try {
            const fetched = await request('/auth/login/', 'POST', { ...data });
            setStatus(fetched.message);
            auth.login(fetched.token);
            setOpen(true);
        } catch (e) {
            setStatus(e.message);
            setOpen(true);
        }
    };

    return (
        <>
            <Head>
                <title>Auth/Registration - Scanprices</title>
            </Head>
            <BlockContent>
                <Snackbar
                    open={open}
                    message={status}
                />

                <div className="header-3">Auth</div>

                <Tabs>
                    <TabList>
                        <Tab>Login</Tab>
                        <Tab>Register</Tab>
                    </TabList>

                    <TabPanel>
                        <form className="form" onSubmit={handleLogin(loginHandler)} noValidate
                              autoComplete="off">
                            <Field>
                                <label htmlFor="email">Email</label>
                                <input name="email" id="email" {...login('email', { required: true })} type="text" className="validate"/>
                            </Field>
                            <Field>
                                <label htmlFor="password">Password</label>
                                <input name="password" id="password" {...login('password', { required: true })} type="password"
                                       className="validate"/>
                            </Field>
                            <Button type="submit" label="Login" name="action"/>
                        </form>
                    </TabPanel>
                    <TabPanel>
                        <form className="form" onSubmit={handleRegister(registerHandler)} noValidate
                              autoComplete="off">
                            <Field>
                                <label htmlFor="name">Name</label>
                                <input name="name" id="name" {...register('name', { required: true })} type="text" className="validate"/>
                            </Field>
                            <Field>
                                <label htmlFor="email">Email</label>
                                <input name="email" id="email" {...register('email', { required: true })} type="text" className="validate"/>
                            </Field>
                            <Field>
                                <label htmlFor="password">Password</label>
                                <input name="password" id="password" {...register('password', { required: true })} type="password"
                                       className="validate"/>
                            </Field>
                            <Button type="submit" label="Register" name="action"/>
                        </form>
                    </TabPanel>
                </Tabs>
            </BlockContent>
        </>
    );
};