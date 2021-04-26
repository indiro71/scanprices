import React, { useState, useEffect, useCallback } from 'react';
import { useHttp } from '../hooks/http.hook';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRubleSign } from '@fortawesome/free-solid-svg-icons';
import { Table } from '../components/Table';
import { BlockContent } from '../components/BlockContent';

export const ProductsPage = () => {
    const { request } = useHttp();
    const [products, setProducts] = useState([]);

    const fetchProducts = useCallback(async () => {
        try {
            const fetched = await request(`/scanprices/products/all/`, 'GET');
            setProducts(fetched.products);
        } catch (e) {
        }
    }, []);

    const deleteProduct = async (deleteProductId) => {
        await request(`/scanprices/products/delete/${deleteProductId}`, 'DELETE');
        fetchProducts();
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const headings = ['Name', 'Shop', 'Current price', 'Delete'];
    const tableBody = products.map(product => {
        const price = +product.currentPrice !== 0 ?
            <span><b>{product.currentPrice}</b> <FontAwesomeIcon icon={faRubleSign}/></span> : 'not available';
        return [
            <Link className="link" to={`/product/${product._id}`}>{product.name}</Link>,
            <a className="link" target="_blank" href={product.url}>{product.shop.name}</a>,
            price,
            <div className="link" onClick={() => deleteProduct(product._id)}>delete</div>
        ];
    });

    return (
        <BlockContent>
            <div className="header-2">Products</div>
            <Table headings={headings} tableBody={tableBody}/>
        </BlockContent>
    );
};