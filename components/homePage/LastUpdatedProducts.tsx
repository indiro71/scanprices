import React, { FC, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import moment from 'moment';
import { Loader } from '../loader/Loader';
import { Table } from '../Table';
import { convertPrice } from '../../helpers';
import { IProduct } from '../../types/product';
import { useHttp } from '../../hooks/http.hook';

interface LastUpdatedData {
  products: IProduct[];
  prices: {
    price: number[]
  }
}

export const LastUpdatedProducts: FC = () => {
  const { request, loading } = useHttp();
  const [lastUpdatedProducts, setLastUpdatedProducts] = useState<IProduct[]>([]);
  const [lastUpdatedData, setLastUpdatedData] = useState<LastUpdatedData>();

  const fetchLastUpdatedProducts = useCallback(async () => {
    try {
      const data = await request<LastUpdatedData>(`/scanprices/products/lastupdated/`, 'GET');
      setLastUpdatedData(data);
    } catch (e) {
    }
  }, []);

  useEffect(() => {
    fetchLastUpdatedProducts();
  }, []);

  useEffect(() => {
    if (!lastUpdatedData) return;
    lastUpdatedData.products.map(product => {
      product.prices = lastUpdatedData.prices[product._id];
    });
    setLastUpdatedProducts(lastUpdatedData.products);
  }, [lastUpdatedData]);

  const tableHeads = ['Name', 'Date update', 'Price change'];
  const tableBody = lastUpdatedProducts && lastUpdatedProducts.map(product => {
    const price = product.prices[1] ? product.prices[0]?.price - product.prices[1]?.price : product.prices[0]?.price;
    return [
      <Link href={`/products/${product._id}`}><a className="link">{product.name}</a></Link>,
      <span
        className={moment().isSame(product.dateUpdate, 'day') ? 'text-xl' : ''}>{moment(product.dateUpdate).format('DD-MM-YYYY  HH:mm')}</span>,
      <span><b className={price > 0 ? 'text-red-500' : 'text-green-500'}>{convertPrice(price)}</b></span>
    ];
  });

  return (
    <>
      <div className="header-3">Last updated products</div>
      {loading ? <Loader visible={loading}/> :
        <Table headings={tableHeads} tableBody={tableBody}/>}
    </>
  );
};