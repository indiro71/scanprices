import React, { useState, useEffect, useCallback } from 'react';
import { useHttp } from '../hooks/http.hook';
import { Link } from 'react-router-dom';
import { LinearProgress } from '@material-ui/core';
import { Table } from '../components/Table';
import M from  'materialize-css/dist/js/materialize.min.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRubleSign } from '@fortawesome/free-solid-svg-icons'

export const ProductsPage = () => {
    const { loading, request } = useHttp();
    const [ products, setProducts ] = useState([]);

    const fetchProducts = useCallback(async () => {
        try {
            const fetched = await request(`/scanprices/products/all/`, 'GET');
            setProducts(fetched.products);
        } catch (e) {}
    }, []);

    const deleteProduct = async (deleteProductId) => {
        const deleted = await request(`/scanprices/products/delete/${deleteProductId}`, 'DELETE');
        fetchProducts();
    }

    useEffect( () => {
        fetchProducts();
    }, []);

    useEffect( () => {
        const tooltips = document.querySelectorAll('.tooltipped');
        M.Tooltip.init(tooltips, {
            'position': 'right'
        })
    }, [products]);

    const headings = ['Name', 'Shop', 'Current price', 'Delete'];
    const tableBody = products.map(product => {
        const price = +product.currentPrice !== 0 ? <span><b>{product.currentPrice}</b> <FontAwesomeIcon icon={faRubleSign} /></span>: 'not available';
        return [
           <Link className="tooltipped"   data-tooltip={`<img style="max-width: 200px;" src="${process.env.REACT_APP_STORAGE_SERVER}/images/${product.image}"/>`} to={`/product/${product._id}`}>{product.name}</Link>,
           <a target="_blank" href={product.url}>{product.shop.name}</a>,
            price,
            <div onClick={()  => deleteProduct(product._id)}>delete</div>
        ]
    });


    return (
        <div className="row">
            <LinearProgress style={{ opacity: loading ? 1 : 0 }} />
            <h2>Products</h2>

            <Table headings={headings} tableBody={tableBody} />
        </div>
    );
}