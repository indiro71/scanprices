import React, { useCallback, useEffect, useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import { Table } from '../components/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRubleSign } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { LinearProgress } from '@material-ui/core';

export const MainPage = () => {
    const { loading, request } = useHttp();
    const [ lastAddedProducts, setLastAddedProducts ] = useState([]);
    const [ lastUpdatedProducts, setLastUpdatedProducts ] = useState([]);

    const fetchLastAddedProducts = useCallback(async () => {
        try {
            const fetched = await request(`/scanprices/products/lastadded/`, 'GET');
            setLastAddedProducts(fetched.products);
        } catch (e) {
        }
    }, []);

    const fetchLastUpdatedProducts = useCallback(async () => {
        try {
            const fetched = await request(`/scanprices/products/lastupdated/`, 'GET');
            fetched.products.map(product => {
                product.prices = fetched.prices[product._id];
            })
            setLastUpdatedProducts(fetched.products);
        } catch (e) {
        }
    }, []);

    useEffect(() => {
        fetchLastAddedProducts();
        fetchLastUpdatedProducts();
    }, []);

    const headAddedTable = [ 'Name', 'Shop', 'Price', 'Date added' ];
    const headUpdatedTable = [ 'Name', 'Date update', 'Price change' ];

    const tableAddedBody = lastAddedProducts.map(product => {
        const price = +product.currentPrice !== 0 ?
            <span><b>{product.currentPrice}</b> <FontAwesomeIcon icon={faRubleSign}/></span> : 'not available';
        return [
            <Link className="tooltipped" to={`/product/${product._id}`}>{product.name}</Link>,
            <a target="_blank" href={product.url}>{product.shop.name}</a>,
            price,
            moment(product.dateCreate).format('DD-MM-YYYY HH:mm')
        ]
    });

    const tableUpdatedBody = lastUpdatedProducts.map(product => {
        const price = product.prices[1] ? product.prices[0]?.price - product.prices[1]?.price : product.prices[0]?.price;
        return [
            <Link className="tooltipped" to={`/product/${product._id}`}>{product.name}</Link>,
            <span
                className={moment().isSame(product.dateUpdate, 'day') ? 'flow-text' : ''}>{moment(product.dateUpdate).format('DD-MM-YYYY  HH:mm')}</span>,
            <span><b className={price > 0 ? 'red-text' : 'green-text'}>{price}</b> <FontAwesomeIcon icon={faRubleSign}/></span>
        ]
    });

    return (
        <div className="masonry row">
            <LinearProgress style={{ opacity: loading ? 1 : 0 }}/>
            <div className="col s12">
                <h2>Scanprices</h2>

                <h4>Last added products</h4>
                <Table headings={headAddedTable} tableBody={tableAddedBody}/>

                <h4>Last updated products</h4>
                <Table headings={headUpdatedTable} tableBody={tableUpdatedBody}/>
            </div>
        </div>
    );
}