import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import Link from 'next/link';
import { BlockContent } from '../components/BlockContent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRubleSign } from '@fortawesome/free-solid-svg-icons';
import { Table } from '../components/Table';
import { useHttp } from '../hooks/http.hook';
import { Loader } from '../components/loader/Loader';


export default function Home() {
    const { request, loading } = useHttp();
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
            <Link className="link" href={`/products/${product._id}`}>{product.name}</Link>,
            <a className="link" target="_blank" rel="noreferrer" href={product.url}>{product.shop.name}</a>,
            price,
            moment(product.dateCreate).format('DD-MM-YYYY HH:mm')
        ]
    });

    const tableUpdatedBody = lastUpdatedProducts.map(product => {
        const price = product.prices[1] ? product.prices[0]?.price - product.prices[1]?.price : product.prices[0]?.price;
        return [
            <Link className="link" href={`/products/${product._id}`}>{product.name}</Link>,
            <span
                className={moment().isSame(product.dateUpdate, 'day') ? 'text-xl' : ''}>{moment(product.dateUpdate).format('DD-MM-YYYY  HH:mm')}</span>,
            <span><b className={price > 0 ? 'text-red-500' : 'text-green-500'}>{price}</b> <FontAwesomeIcon icon={faRubleSign}/></span>
        ]
    });

  return (
    <>
      <Head>
        <title>Main page - Scanprices</title>
      </Head>
        <BlockContent>
            <div className="header-3">Last added products</div>
            {loading ? <Loader visible={loading}/> : <Table headings={headAddedTable} tableBody={tableAddedBody}/>}

            <div className="header-3">Last updated products</div>
            {loading ? <Loader visible={loading}/> : <Table headings={headUpdatedTable} tableBody={tableUpdatedBody}/>}
        </BlockContent>
    </>
  )
}
