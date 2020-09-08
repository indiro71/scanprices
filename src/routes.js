import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { GoodsPage } from './pages/GoodsPage';
import { AddGoodPage } from './pages/AddGoodPage';
import { DetailPage } from './pages/DetailPage';

export const useRoutes = () => {
    return (
        <Switch>
            <Route path={'/'} exact>
                <MainPage/>
            </Route>
            <Route path={'/goods'} exact>
                <GoodsPage/>
            </Route>
            <Route path={'/add-good'} exact>
                <AddGoodPage/>
            </Route>
            <Route path={"/good/:id"}>
                <DetailPage />
            </Route>

            <Redirect to={'/'}/>
        </Switch>
    );
}