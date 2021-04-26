import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { LinearProgress } from '@material-ui/core';
import { faRubleSign } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import { BlockContent } from '../components/BlockContent';

export const DetailProductPage = () => {
    const { loading, request } = useHttp();
    const [product, setProduct] = useState([]);
    const [diffPrice, setDiffPrice] = useState(0);
    const productId = useParams().id;

    const fetchProduct = useCallback(async () => {
        try {
            const fetched = await request(`/scanprices/products/item/${productId}`, 'GET');
            setProduct(fetched.data);
            setDiffPrice(fetched.data.prices[fetched.data.prices.length - 2].price);
        } catch (e) {
        }
    }, []);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    const dataChart = {
        labels: product.prices ? product.prices.map(price => moment(price.date).format('DD MM YYYY')) : '',
        datasets: [
            {
                label: 'Product price',
                backgroundColor: '#ffffff',
                borderColor: '#000000',
                data: product.prices ? product.prices.map(price => price.price) : '',
                fill: false,
            }
        ]
    };

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
        <BlockContent>
            {product.params ?
                <div>
                    <div className="header-2">{product.params.name}</div>

                    <div className="flex w-full ">
                        <div className="w-1/4 mx-5 p-4 shadow-lg rounded-2xl bg-white">
                            <img className="max-w-full" alt={product.params.name}
                                 src={`${process.env.REACT_APP_STORAGE_SERVER}/images/${product.params.image}`}/>
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
                                    <p>{product.params.currentPrice} <FontAwesomeIcon icon={faRubleSign}/></p>
                                    <p>{product.params.currentPrice > diffPrice ?
                                        <span
                                            className="text-red-500">+ {product.params.currentPrice - diffPrice}</span> :
                                        <span
                                            className="text-green-500">{product.params.currentPrice - diffPrice}</span>}</p>
                                </div>
                                <div className="w-1/3 mx-3 text-center">
                                    <p><b>Maximum price: </b></p>
                                    <p>{product.params.maxPrice} <FontAwesomeIcon icon={faRubleSign}/></p>
                                    <p><span
                                        className="text-green-500">- {product.params.maxPrice - product.params.currentPrice}</span>
                                    </p>
                                </div>
                                <div className="w-1/3 mx-3 text-center">
                                    <p><b>Minimum price: </b></p>
                                    <p>{product.params.minPrice} <FontAwesomeIcon icon={faRubleSign}/></p>
                                    <p><span
                                        className="text-red-500">+ {product.params.currentPrice - product.params.minPrice}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="card-action">
                                <a className="link uppercase px-3" target="_blank"
                                   href={product.params.url}>Go to shop {product.params.shop.name}</a>
                                {/*<a href="#">Subscribe</a>*/}
                                {/*<a href="#">Delete</a>*/}
                                {/*<a href="#">Edit</a>*/}
                            </div>
                        </div>
                    </div>

                    <div className="mx-5 mt-5 p-4 shadow-lg rounded-2xl bg-white">
                        <Line data={dataChart} options={optionsChart} height={400}/>
                    </div>
                </div>
                : null}
        </BlockContent>
    );
};