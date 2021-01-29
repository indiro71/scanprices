import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useHttp } from '../hooks/http.hook';
import { Link } from 'react-router-dom';
import { LinearProgress } from '@material-ui/core';

export const ShopsPage = () => {
    const { loading, request } = useHttp();
    const [ shops, setShops ] = useState([]);

    const fetchShops = useCallback(async () => {
        try {
            const fetched = await request(`/scanprices/shops/all/`, 'GET');
            setShops(fetched.shops);
        } catch (e) {}
    }, []);

    const deleteShop = async ( deleteShopId) => {
        const deleted = await request(`/scanprices/shops/delete/${deleteShopId}`, 'DELETE');
        fetchShops();
    }

    useEffect( () => {
        fetchShops();
    }, []);

    return (
        <div className="masonry row">
            <LinearProgress style={{ opacity: loading ? 1 : 0 }} />
            <div className="col s12">
                <h2>Shops</h2>
            </div>

            {shops.map(shop => {
                return (
                    <div className="col xl l4 m6 s12">
                        <div className="card">
                            <Link to={`/shop/${shop._id}`}>
                                <div className="card-content">
                                    <span className="card-title center-align activator grey-text text-darken-4">{shop.name}</span>
                                </div>
                            </Link>
                            <div className="card-action">
                                <div  onClick={() => deleteShop(shop._id)}>Delete</div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}