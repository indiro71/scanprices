import React, { useState, useEffect, useCallback } from 'react';
import { useHttp } from '../hooks/http.hook';
import { Link } from 'react-router-dom';
import { LinearProgress } from '@material-ui/core';
import { Table } from '../components/Table';
import M from  'materialize-css/dist/js/materialize.min.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRubleSign } from '@fortawesome/free-solid-svg-icons'

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

    const deleteGood = async (deleteGoodId) => {
        const deleted = await request(`/dev/scanprice/good/${deleteGoodId}`, 'DELETE');
        fetchGoods();
    }

    useEffect( () => {
        fetchGoods();
    }, []);

    useEffect( () => {
        const tooltips = document.querySelectorAll('.tooltipped');
        console.log(tooltips)
        M.Tooltip.init(tooltips, {
            'position': 'left'
        })
    }, [goods]);

    const headings = ['Name', 'Shop', 'Current price'];
    const tableBody = goods.map(good => {
        return [
           <Link className="tooltipped"   data-tooltip={`<img style="max-width: 200px;" src=${process.env.REACT_APP_STORAGE_SERVER}/images/${good.image}/>`} to={`/good/${good._id}`}>{good.name}</Link>,
           <a target="_blank" href={good.url}>{good.shop.name}</a>,
           <span><b>{good.currentPrice}</b> <FontAwesomeIcon icon={faRubleSign} /></span>
        ]
    });


    return (
        <div className="row">
            <LinearProgress style={{ opacity: loading ? 1 : 0 }} />
            <h2>Goods</h2>

            <Table headings={headings} tableBody={tableBody} />
        </div>
    );
}