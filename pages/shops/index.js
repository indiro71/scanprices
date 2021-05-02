import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useHttp } from '../../hooks/http.hook';
import { BlockContent } from '../../components/BlockContent';
import Head from 'next/head';

export default function Shops() {
    const { request } = useHttp();
    const [shops, setShops] = useState([]);

    const fetchShops = useCallback(async () => {
        try {
            const fetched = await request(`/scanprices/shops/all/`, 'GET');
            setShops(fetched.shops);
        } catch (e) {
        }
    }, []);

    const deleteShop = async (deleteShopId) => {
        await request(`/scanprices/shops/delete/${deleteShopId}`, 'DELETE');
        fetchShops();
    };

    useEffect(() => {
        fetchShops();
    }, []);

    return (
        <>
            <Head>
                <title>Shops - Scanprices</title>
            </Head>
            <BlockContent>
                <div className="header-2">Shops</div>
                <div className="flex flex-wrap -mx-1.5">
                    {shops.map(shop => {
                        return (
                            <div
                                key={shop._id}
                                className="flex w-1/6 rounded-2xl p-2 justify-center bg-gray-400 bg-opacity-60 flex-wrap mx-1.5">
                                <Link href={`/shops/${shop._id}`}>
                                    <div className="w-full text-center header-3 link hover:no-underline">{shop.name}</div>
                                </Link>
                                <div className="border-t border-black pt-2 w-full text-center">
                                    <div className="link" onClick={() => deleteShop(shop._id)}>Delete</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </BlockContent>
        </>
    );
};