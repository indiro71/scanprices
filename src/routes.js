import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { GoodsPage } from './pages/GoodsPage';
import { AddGoodPage } from './pages/AddGoodPage';
import { DetailGoodPage } from './pages/DetailGoodPage';
import { ShopsPage } from './pages/ShopsPage';
import { AddShopPage } from './pages/AddShopPage';
import { DetailShopPage } from './pages/DetailShopPage';

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
                <DetailGoodPage />
            </Route>

            <Route path={'/shops'} exact>
                <ShopsPage/>
            </Route>
            <Route path={'/add-shop'} exact>
                <AddShopPage/>
            </Route>
            <Route path={"/shop/:id"}>
                <DetailShopPage />
            </Route>

            <Redirect to={'/'}/>
        </Switch>
    );
}