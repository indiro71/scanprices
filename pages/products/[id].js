import React, { useState, useEffect, useCallback, useMemo, useContext, useRef } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { BlockContent } from '../../components/BlockContent';
import Head from 'next/head';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import { Loader } from '../../components/loader/Loader';
import { AuthContext } from '../../context/AuthContext';
import { Field } from '../../components/form';
import { convertPrice } from '../../helpers';


const DetailProductPage = ({ productId }) => {
        const { request, loading } = useHttp();
        const [product, setProduct] = useState({});
        const [diffPrice, setDiffPrice] = useState(0);
        const [editAlertPrice, setEditAlertPrice] = useState(false);
        const auth = useContext(AuthContext);
        const inputRef = useRef();

        const fetchProduct = useCallback(async () => {
            try {
                const product = await request(`/scanprices/products/${productId}`, 'GET');
                setProduct(product);
                setDiffPrice(product.prices[product.prices.length - 2].price);
            } catch (e) {
            }
        }, []);

        const fetchSubscribe = useCallback(async () => {
            if (!inputRef.current?.value) return;

            try {
                const fetched = await request(`/scanprices/subscribe/`, 'POST',
                    {
                        price: inputRef.current?.value,
                        productId
                    });
                setEditAlertPrice(false);
                setProduct({ ...product, subscribe: fetched.data });
            } catch (e) {
            }
        }, [product]);

        const fetchUnSubscribe = useCallback(async () => {
            try {
                const fetched = await request(`/scanprices/unsubscribe/`, 'POST',
                    {
                        productId
                    });
                setEditAlertPrice(false);
                setProduct({ ...product, subscribe: undefined });
            } catch (e) {
            }
        }, [product]);

        useEffect(() => {
            fetchProduct();
        }, [fetchProduct]);

        const reversed = useMemo(() => {
            const { prices } = product;
            if (!prices) return undefined;
            const allPrices = [];
            const revPrices = [];
            for (let i = prices.length; i !== 0; i--) {
                if (prices[i - 1]?.price && !allPrices.includes(prices[i - 1]?.price)) {
                    allPrices.push(prices[i - 1].price);
                    revPrices.push(prices[i - 1]);
                }
            }
            return revPrices.reverse();
        }, [product.prices]);

        const dataChart = {
            labels: reversed ? reversed.map(price => moment(price.date).format('DD MM YYYY')) : '',
            datasets: [
                {
                    label: 'Product price',
                    backgroundColor: '#ffffff',
                    borderColor: '#000000',
                    data: reversed ? reversed.map(price => price.price) : '',
                    fill: false,
                }
            ]
        };

        useEffect(() => {
            const onKeypress = e => {
                if (e.code === 'Enter' && inputRef.current?.value) {
                    fetchSubscribe();
                }
            };
            document.addEventListener('keypress', onKeypress);

            return () => {
                document.removeEventListener('keypress', onKeypress);
            };
        }, [product]);

        const optionsChart = {
            maintainAspectRatio: false,
            responsive: true,
            title: {
                display: true,
                text: 'Changes in product prices'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Price'
                    }
                }]
            }
        };

        return (
            <>
                <Head>
                    <title>{product?.params?.name} - Scanprices</title>
                </Head>
                <BlockContent>
                    {loading && <Loader visible={loading}/>}
                    {product.params && !loading ?
                        <div>
                            <div className="header-2">{product.params.name}</div>

                            <div className="flex w-full ">
                                <div className="w-1/4 mx-5 p-4 shadow-lg rounded-2xl bg-white">
                                    <img className="max-w-full" alt={product.params.name}
                                         src={`${process.env.NEXT_PUBLIC_REACT_APP_STORAGE_SERVER}/images/${product.params.image}`}/>
                                </div>

                                <div className="w-3/4 mx-5 p-4 shadow-lg rounded-2xl bg-white h-full">
                                    <div className="w-full flex justify-center mb-3">
                                        <div className="w-1/2 mx-3 text-center">
                                            <p><b>Date created: </b></p>
                                            <p>{moment(product.params.dateCreate).format('DD-MM-YYYY, HH:mm:ss')}</p>
                                        </div>
                                        <div className="w-1/2 mx-3 text-center">
                                            <p><b>Date updated: </b></p>
                                            <p>{moment(product.params.dateUpdate).format('DD-MM-YYYY, HH:mm:ss')}</p>
                                        </div>
                                    </div>

                                    <div className="w-full flex justify-center mb-3 border-b border-gray-200 pb-6">
                                        <div className="w-1/3 mx-3 text-center">
                                            <p><b>Current price: </b></p>
                                            <p>{convertPrice(product.params.currentPrice)} </p>
                                            <p>{product.params.currentPrice > diffPrice ?
                                                <span
                                                    className="text-red-500">+ {convertPrice(product.params.currentPrice - diffPrice)}</span> :
                                                <span
                                                    className="text-green-500">{convertPrice(product.params.currentPrice - diffPrice)}</span>}</p>
                                        </div>
                                        <div className="w-1/3 mx-3 text-center">
                                            <p><b>Maximum price: </b></p>
                                            <p>{convertPrice(product.params.maxPrice)} </p>
                                            <p><span
                                                className="text-green-500">- {convertPrice(product.params.maxPrice - product.params.currentPrice)}</span>
                                            </p>
                                        </div>
                                        <div className="w-1/3 mx-3 text-center">
                                            <p><b>Minimum price: </b></p>
                                            <p>{convertPrice(product.params.minPrice)} </p>
                                            <p><span
                                                className="text-red-500">+ {convertPrice(product.params.currentPrice - product.params.minPrice)}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="w-full flex items-center justify-between">
                                        {/*<a href="#">Delete</a>*/}
                                        {/*<a href="#">Edit</a>*/}
                                        {auth.token && <div>
                                            {product.subscribe ?
                                                <div className="flex items-center">
                                                    <p className="mr-3">Alert price: </p>
                                                    {!editAlertPrice && <p className="cursor-pointer"
                                                                           onClick={() => setEditAlertPrice(true)}>{convertPrice(product.subscribe.price)}</p>}
                                                    {editAlertPrice && <div className="flex items-center">
                                                        <Field>
                                                            <input autoFocus ref={inputRef} name="alertPrice"
                                                                   id="alertPrice" defaultValue={product.subscribe.price}
                                                                   type="text"/>
                                                        </Field>
                                                        <p onClick={() => setEditAlertPrice(false)}
                                                           className="text-blue-600 cursor-pointer ml-3 hover:underline">Cancel</p>
                                                    </div>}
                                                    {!editAlertPrice && <p onClick={() => fetchUnSubscribe()}
                                                                           className="ml-3 text-blue-600 cursor-pointer underline text-sm hover:underline">Unsubscribe</p>}
                                                </div>
                                                :
                                                <div>
                                                    {!editAlertPrice && <p onClick={() => setEditAlertPrice(true)}
                                                                           className="text-blue-600 cursor-pointer">Subscribe
                                                        on alert min
                                                        price</p>}
                                                    {editAlertPrice && <div className="flex items-center">
                                                        <Field>
                                                            <input autoFocus ref={inputRef} name="alertPrice"
                                                                   id="alertPrice" type="text"/>
                                                        </Field>
                                                        <p onClick={() => fetchSubscribe()}
                                                           className="text-blue-600 cursor-pointer ml-3 hover:underline">Save</p>
                                                        <p onClick={() => setEditAlertPrice(false)}
                                                           className="text-blue-600 cursor-pointer ml-3 hover:underline">Cancel</p>
                                                    </div>}
                                                </div>}
                                        </div>}
                                        <a className="link uppercase px-3 mr-3" target="_blank" rel="noreferrer"
                                           href={product.params.url}>Go to shop {product.params.shop.name}</a>
                                    </div>
                                </div>
                            </div>

                            <div className="mx-5 mt-5 p-4 shadow-lg rounded-2xl bg-white">
                                <Line data={dataChart} options={optionsChart} height={400}/>
                            </div>
                        </div>
                        : null}
                </BlockContent>
            </>
        );
    }
;

export default DetailProductPage;

export const getServerSideProps = async (
    {
        params
    }
) => {
    return {
        props: {
            productId: params.id
        }
    };
};