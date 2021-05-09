import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRubleSign } from '@fortawesome/free-solid-svg-icons';
import { useHttp } from '../../hooks/http.hook';
import { BlockContent } from '../../components/BlockContent';
import { Table } from '../../components/Table';
import Head from 'next/head';
import { Loader } from '../../components/loader/Loader';

export default function Products() {
    const { request, loading } = useHttp();
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
            <Link className="link" href={`/products/${product._id}`}>{product.name}</Link>,
            <a className="link" target="_blank" rel="noreferrer" href={product.url}>{product.shop.name}</a>,
            price,
            <div className="link" onClick={() => deleteProduct(product._id)}>delete</div>
        ];
    });

    return (
        <>
            <Head>
                <title>Products page - Scanprices</title>
            </Head>
            <BlockContent>
                <div className="header-2">Products</div>
                {loading ? <Loader visible={loading}/> : <Table headings={headings} tableBody={tableBody}/>}
            </BlockContent>
        </>
    );
};