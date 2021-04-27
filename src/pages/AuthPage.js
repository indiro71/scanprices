import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LinearProgress, Snackbar } from '@material-ui/core';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';
import { BlockContent } from '../components/BlockContent';

export const AuthPage = () => {
    const auth = useContext(AuthContext);
    const { request } = useHttp();
    const { register: login, handleSubmit: handleLogin } = useForm();
    const { register: register, handleSubmit: handleRegister } = useForm();
    const [ open, setOpen ] = useState(false);
    const [ status, setStatus ] = useState('');

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

            <div className="">
                <div className="">
                    <div className="header-3">Auth</div>

                    <div className="row">
                        <div className="col s6">
                            <ul className="tabs">
                                <li className="tab col s3"><a className="active" href="#login">Login</a></li>
                                <li className="tab col s3"><a href="#register">Register</a></li>
                            </ul>
                        </div>
                        <div id="login" className="col s12">
                            <form className={'login'} onSubmit={handleLogin(loginHandler)} noValidate
                                  autoComplete="off">
                                <div className="row">
                                    <div className="input-field col s6">
                                        <label htmlFor="email">Email</label>
                                        <input name="email" id="email" ref={login} type="text" className="validate"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field col s6">
                                        <label htmlFor="password">Password</label>
                                        <input name="password" id="password" ref={login} type="text"
                                               className="validate"/>
                                    </div>
                                </div>
                                <button className="btn waves-effect waves-light" type="submit" name="action">Login
                                    <i className="material-icons right"></i>
                                </button>
                            </form>
                        </div>
                        <div id="register" className="col s12">
                            <form className={'register'} onSubmit={handleRegister(registerHandler)} noValidate
                                  autoComplete="off">
                                <div className="row">
                                    <div className="input-field col s6">
                                        <label htmlFor="name">Name</label>
                                        <input name="name" id="name" ref={register} type="text" className="validate"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field col s6">
                                        <label htmlFor="email">Email</label>
                                        <input name="email" id="email" ref={register} type="text" className="validate"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field col s6">
                                        <label htmlFor="password">Password</label>
                                        <input name="password" id="password" ref={register} type="password"
                                               className="validate"/>
                                    </div>
                                </div>
                                <button className="btn waves-effect waves-light" type="submit" name="action">Register
                                    <i className="material-icons right"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </BlockContent>
    );
}