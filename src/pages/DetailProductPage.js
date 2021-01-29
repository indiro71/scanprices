import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { LinearProgress } from '@material-ui/core';
import M from 'materialize-css/dist/js/materialize.min.js';
import { faRubleSign } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

export const DetailProductPage = () => {
    const { loading, request } = useHttp();
    const [ product, setProduct ] = useState([]);
    const [ diffPrice, setDiffPrice ] = useState(0);
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
    }, [ fetchProduct ]);

    useEffect(() => {
        const images = document.querySelectorAll('.materialboxed');
        M.Materialbox.init(images, {})
    }, [ product ]);

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
            xAxes: [ {
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Date'
                }
            } ],
            yAxes: [ {
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Price'
                }
            } ]
        }
    };

    return (
        <div className="row">
            <LinearProgress style={{ opacity: loading ? 1 : 0 }}/>
            {product.params ?
                <div>
                    <div className="col xl12">
                        <div className="card z-depth-1">
                            <div className="card-content">
                                <h1 style={{fontSize: '22px', margin: 0}}>{product.params.name}</h1>
                            </div>
                        </div>
                    </div>

                    <div className="col s12 xl4">
                        <div className="card z-depth-1">
                            <div className="container">
                                <div className="card-image">
                                    <div className="card-content">
                                        <img className="materialboxed" alt={product.params.name}
                                             src={`${process.env.REACT_APP_STORAGE_SERVER}/images/${product.params.image}`}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col s12 xl8">
                        <div className="card z-depth-1">
                            <div className="card-content">
                                <div className="row">
                                    <div className="col s12 m6 xl6 center-align">
                                        <p><b>Date created: </b></p>
                                        <p>{moment(product.params.dateCreate).format('DD-MM-YYYY, HH:mm:ss')}</p>
                                    </div>
                                    <div className="col s12 m6 xl6 center-align">
                                        <p><b>Date updated: </b></p>
                                        <p>{moment(product.params.dateUpdate).format('DD-MM-YYYY, HH:mm:ss')}</p>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col s12 m4 xl4 center-align">
                                        <p><b>Current price: </b></p>
                                        <p>{product.params.currentPrice} <FontAwesomeIcon icon={faRubleSign}/></p>
                                        <p>{product.params.currentPrice > diffPrice ?
                                            <span className="red-text">+ {product.params.currentPrice - diffPrice}</span> : <span
                                                className="green-text">{product.params.currentPrice - diffPrice}</span>}</p>
                                    </div>
                                    <div className="col s12 m4 xl4 center-align">
                                        <p><b>Maximum price: </b></p>
                                        <p>{product.params.maxPrice} <FontAwesomeIcon icon={faRubleSign}/></p>
                                        <p><span
                                            className="green-text">- {product.params.maxPrice - product.params.currentPrice}</span>
                                        </p>
                                    </div>
                                    <div className="col s12 m4 xl4 center-align">
                                        <p><b>Minimum price: </b></p>
                                        <p>{product.params.minPrice} <FontAwesomeIcon icon={faRubleSign}/></p>
                                        <p><span
                                            className="red-text">+ {product.params.currentPrice - product.params.minPrice}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-action">
                                <a className="black-text" target="_blank"
                                   href={product.params.url}>Go to shop {product.params.shop.name}</a>
                                {/*<a href="#">Subscribe</a>*/}
                                {/*<a href="#">Delete</a>*/}
                                {/*<a href="#">Edit</a>*/}
                            </div>
                        </div>
                    </div>


                    <div className="col s12 xl12">
                        <div className="card">
                            <Line data={dataChart} options={optionsChart} height={400}/>
                        </div>
                    </div>
                </div>
                : null}
        </div>
    );
}