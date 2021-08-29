import React, { FC, useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import Link from 'next/link';
import { convertPrice } from '../../helpers';
import { Loader } from '../loader/Loader';
import { Table } from '../Table';
import { IProduct } from '../../types/product';
import { useHttp } from '../../hooks/http.hook';

export const LastAddedProducts: FC = () => {
  const [lastAddedProducts, setLastAddedProducts] = useState<IProduct[]>([]);
  const { request, loading } = useHttp();

  const fetchLastAddedProducts = useCallback(async () => {
    try {
      const products = await request<IProduct[]>(
        `/scanprices/products/lastadded/`,
        'GET',
      );
      setLastAddedProducts(products);
    } catch (e) {}
  }, []);

  useEffect(() => {
    fetchLastAddedProducts();
  }, []);

  const tableHeads = ['Name', 'Shop', 'Price', 'Date added'];
  const tableBody =
    lastAddedProducts &&
    lastAddedProducts.map((product) => {
      const price =
        +product.currentPrice !== 0 ? (
          <span>
            <b>{convertPrice(product.currentPrice)}</b>{' '}
          </span>
        ) : (
          'not available'
        );
      return [
        <Link href={`/products/${product._id}`}>
          <a className="link">{product.name}</a>
        </Link>,
        <a className="link" target="_blank" rel="noreferrer" href={product.url}>
          {product.shop.name}
        </a>,
        price,
        moment(product.dateCreate).format('DD-MM-YYYY HH:mm'),
      ];
    });

  return (
    <>
      <div className="header-3">Last added products</div>
      {loading ? (
        <Loader visible={loading} />
      ) : (
        <Table headings={tableHeads} tableBody={tableBody} />
      )}
    </>
  );
};
