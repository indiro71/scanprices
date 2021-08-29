import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useHttp } from '../../hooks/http.hook';
import { BlockContent } from '../../components/BlockContent';
import { Table } from '../../components/Table';
import { Loader } from '../../components/loader/Loader';
import { convertPrice } from '../../helpers';
import { IProduct } from '../../types/product';

export default function Products(): JSX.Element {
  const { request, loading } = useHttp();
  const [products, setProducts] = useState([]);

  const fetchProducts = useCallback(async () => {
    try {
      const products = await request<IProduct[]>(
        `/scanprices/products/`,
        'GET',
      );
      setProducts(products);
    } catch (e) {}
  }, []);

  const deleteProduct = async (deleteProductId) => {
    await request<IProduct>(
      `/scanprices/products/${deleteProductId}`,
      'DELETE',
    );
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const tableHeads = ['Name', 'Shop', 'Current price', 'Delete'];
  const tableBody =
    products &&
    products.map((product) => {
      const price =
        +product.currentPrice !== 0 ? (
          <span>
            <b>{convertPrice(product.currentPrice)}</b>
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
        <div className="link" onClick={() => deleteProduct(product._id)}>
          delete
        </div>,
      ];
    });

  return (
    <>
      <Head>
        <title>Products page - Scanprices</title>
      </Head>
      <BlockContent>
        <div className="header-2">Products</div>
        {loading ? (
          <Loader visible={loading} />
        ) : (
          <Table headings={tableHeads} tableBody={tableBody} />
        )}
      </BlockContent>
    </>
  );
}
