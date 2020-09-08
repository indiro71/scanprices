import React, { useState, useEffect, useCallback } from 'react';
import { useHttp } from '../hooks/http.hook';
import { Link } from 'react-router-dom';
import { LinearProgress } from '@material-ui/core';

export const GoodsPage = () => {
    const { loading, request } = useHttp();
    const [ goods, setGoods ] = useState([]);


    const fetchGoods = useCallback(async () => {
        try {
            try {
                const fetched = await request(`/dev/scanprice/goods/`, 'GET');
                setGoods(fetched.goods);
            } catch (e) {}
        } catch (e) {}
    }, []);

    useEffect( () => {
        fetchGoods();
    }, []);

    return (
        <div className="masonry row">
            <LinearProgress style={{ opacity: loading ? 1 : 0 }} />
            <div className="col s12">
                <h2>Goods</h2>
            </div>

            {goods.map(good => {
                return (
                    <div className="col xl l4 m6 s12">
                        <div className="card">
                            <Link to={`/good/${good._id}`}>
                                <div className="card-image waves-effect waves-block waves-light">
                                    <img alt={good.name} className="activator" src={`${process.env.REACT_APP_STORAGE_SERVER}/images/${good.image}`}/>
                                </div>
                                <div className="card-content">
                                    <span className="card-title center-align activator grey-text text-darken-4">{good.name}</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}