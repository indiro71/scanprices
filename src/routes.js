import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { ProductsPage } from './pages/ProductsPage';
import { AddProductPage } from './pages/AddProductPage';
import { DetailProductPage } from './pages/DetailProductPage';
import { ShopsPage } from './pages/ShopsPage';
import { AddShopPage } from './pages/AddShopPage';
import { DetailShopPage } from './pages/DetailShopPage';
import { AuthPage } from './pages/AuthPage';

export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path={'/'} exact>
                    <MainPage/>
                </Route>
                <Route path={'/products'} exact>
                    <ProductsPage/>
                </Route>
                <Route path={'/add-product'} exact>
                    <AddProductPage/>
                </Route>
                <Route path={"/product/:id"}>
                    <DetailProductPage />
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
    } else {
        return (
            <Switch>
                <Route path={'/'} exact>
                    <MainPage/>
                </Route>
                <Route path={'/auth'} exact>
                    <AuthPage/>
                </Route>
                <Route path={'/products'} exact>
                    <ProductsPage/>
                </Route>
                <Route path={"/product/:id"}>
                    <DetailProductPage />
                </Route>

                <Route path={'/shops'} exact>
                    <ShopsPage/>
                </Route>
                <Route path={"/shop/:id"}>
                    <DetailShopPage />
                </Route>

                <Redirect to={'/'}/>
            </Switch>
        );
    }
}