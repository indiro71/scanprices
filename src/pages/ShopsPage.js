import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { BlockContent } from '../components/BlockContent';

export const ShopsPage = () => {
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
        <BlockContent>
            <div className="header-2">Shops</div>
            <div className="flex flex-wrap -mx-1.5">
                {shops.map(shop => {
                    return (
                        <div
                            className="flex w-1/6 rounded-2xl p-2 justify-center bg-gray-400 bg-opacity-60 flex-wrap mx-1.5">
                            <Link className="link w-full text-center" to={`/shop/${shop._id}`}>
                                <div className="header-3 hover:no-underline">{shop.name}</div>
                            </Link>
                            <div className="border-t border-black pt-2 w-full text-center">
                                <div className="link" onClick={() => deleteShop(shop._id)}>Delete</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </BlockContent>
    );
};