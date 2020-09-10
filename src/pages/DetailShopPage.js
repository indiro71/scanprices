import React, { useCallback, useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { LinearProgress } from '@material-ui/core';

export const DetailShopPage = () => {
    const { loading, request } = useHttp();
    const [ shop, setShop ] = useState([]);
    const shopId = useParams().id;

    const fetchShop = useCallback(async () => {
        try {
            try {
                const fetched = await request(`/dev/scanprice/shop/${shopId}`, 'GET');
                setShop(fetched.data);
            } catch (e) {}
        } catch (e) {}
    }, []);

    useEffect( () => {
        fetchShop();
    }, [fetchShop]);

    return (
        <div className="masonry row">
            <LinearProgress style={{ opacity: loading ? 1 : 0 }} />
            {shop.params ?
                <div className="row">
                    <div className="col xl12">
                        <div className="card">
                            <div className="card-title">{shop.params.name}</div>
                            <div className="card-content">
                                <p><b>Price tag: </b>{shop.params.tagPrices.join(', ')} </p>
                                <p><b>Name tag: </b>{shop.params.tagName} </p>
                            </div>
                        </div>
                    </div>
                </div>
                : null}
        </div>
    );
}