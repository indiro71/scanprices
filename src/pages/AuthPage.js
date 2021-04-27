import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Snackbar } from '@material-ui/core';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';
import { BlockContent } from '../components/BlockContent';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Button, Field } from '../components/form';

export const AuthPage = () => {
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
        }
    };

    return (
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
                            <input name="email" id="email" ref={login} type="text" className="validate"/>
                        </Field>
                        <Field>
                            <label htmlFor="password">Password</label>
                            <input name="password" id="password" ref={login} type="password"
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
                            <input name="name" id="name" ref={register} type="text" className="validate"/>
                        </Field>
                        <Field>
                            <label htmlFor="email">Email</label>
                            <input name="email" id="email" ref={register} type="text" className="validate"/>
                        </Field>
                        <Field>
                            <label htmlFor="password">Password</label>
                            <input name="password" id="password" ref={register} type="password"
                                   className="validate"/>
                        </Field>
                        <Button type="submit" label="Register" name="action"/>
                    </form>
                </TabPanel>
            </Tabs>
        </BlockContent>
    );
};