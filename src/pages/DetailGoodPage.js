import React, { useCallback, useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { LinearProgress } from '@material-ui/core';

export const DetailGoodPage = () => {
    const { loading, request } = useHttp();
    const [ good, setGood ] = useState([]);
    const goodId = useParams().id;

    const fetchGood = useCallback(async () => {
        try {
            try {
                const fetched = await request(`/dev/scanprice/good/${goodId}`, 'GET');
                setGood(fetched.data);
            } catch (e) {}
        } catch (e) {}
    }, []);

    useEffect( () => {
        fetchGood();
    }, [fetchGood]);

    return (
        <div className="masonry row">
            <LinearProgress style={{ opacity: loading ? 1 : 0 }} />
            {good.params ?
                <div className="row">
                    <div className="col xl12">
                        <div className="card">
                            <div className="card-image">
                                <img style={{'maxWidth': '100px'}} alt={good.params.name} src={`${process.env.REACT_APP_STORAGE_SERVER}/images/${good.params.image}`}/>
                            </div>
                            <div className="card-title">{good.params.name}</div>
                            <div className="card-content">
                                <p><b>Current price: </b>{good.params.currentPrice} rub.</p>
                                <p><b>Maximum price: </b>{good.params.maxPrice} rub.</p>
                                <p><b>Minimum price: </b>{good.params.minPrice} rub.</p>
                            </div>
                            <div className="card-action">
                                <a href="#">Subscribe</a>
                            </div>
                        </div>
                    </div>
                </div>
                : null}
        </div>
    );
}