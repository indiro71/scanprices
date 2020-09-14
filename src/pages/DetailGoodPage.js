import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { LinearProgress } from '@material-ui/core';
import M from 'materialize-css/dist/js/materialize.min.js';
import { faRubleSign } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

export const DetailGoodPage = () => {
    const { loading, request } = useHttp();
    const [ good, setGood ] = useState([]);
    const [ diffPrice, setDiffPrice ] = useState(0);
    const goodId = useParams().id;

    const fetchGood = useCallback(async () => {
        try {
            try {
                const fetched = await request(`/dev/scanprice/good/${goodId}`, 'GET');
                setGood(fetched.data);
                setDiffPrice(fetched.data.prices[fetched.data.prices.length - 2].price);
            } catch (e) {
            }
        } catch (e) {
        }
    }, []);

    useEffect(() => {
        fetchGood();
    }, [ fetchGood ]);

    useEffect(() => {
        const images = document.querySelectorAll('.materialboxed');
        M.Materialbox.init(images, {})
    }, [ good ]);

    const dataChart = {
        labels: good.prices ? good.prices.map(price => moment(price.date).format('DD MM YYYY')) : '',
        datasets: [
            {
                label: 'Good price',
                backgroundColor: '#ffffff',
                borderColor: '#000000',
                data: good.prices ? good.prices.map(price => price.price) : '',
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
            {good.params ?
                <div>
                    <div className="col xl12">
                        <div className="card z-depth-1">
                            <div className="card-content">
                                <h1 style={{fontSize: '22px', margin: 0}}>{good.params.name}</h1>
                            </div>
                        </div>
                    </div>

                    <div className="col s12 xl4">
                        <div className="card z-depth-1">
                            <div className="container">
                                <div className="card-image">
                                    <div className="card-content">
                                        <img className="materialboxed" alt={good.params.name}
                                             src={`${process.env.REACT_APP_STORAGE_SERVER}/images/${good.params.image}`}/>
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
                                        <p>{moment(good.params.dateCreate).format('DD-MM-YYYY, HH:mm:ss')}</p>
                                    </div>
                                    <div className="col s12 m6 xl6 center-align">
                                        <p><b>Date updated: </b></p>
                                        <p>{moment(good.params.dateUpdate).format('DD-MM-YYYY, HH:mm:ss')}</p>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col s12 m4 xl4 center-align">
                                        <p><b>Current price: </b></p>
                                        <p>{good.params.currentPrice} <FontAwesomeIcon icon={faRubleSign}/></p>
                                        <p>{good.params.currentPrice > diffPrice ?
                                            <span className="red-text">+ {good.params.currentPrice - diffPrice}</span> : <span
                                                className="green-text">{good.params.currentPrice - diffPrice}</span>}</p>
                                    </div>
                                    <div className="col s12 m4 xl4 center-align">
                                        <p><b>Maximum price: </b></p>
                                        <p>{good.params.maxPrice} <FontAwesomeIcon icon={faRubleSign}/></p>
                                        <p><span
                                            className="green-text">- {good.params.maxPrice - good.params.currentPrice}</span>
                                        </p>
                                    </div>
                                    <div className="col s12 m4 xl4 center-align">
                                        <p><b>Minimum price: </b></p>
                                        <p>{good.params.minPrice} <FontAwesomeIcon icon={faRubleSign}/></p>
                                        <p><span
                                            className="red-text">+ {good.params.currentPrice - good.params.minPrice}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-action">
                                <a className="black-text" target="_blank"
                                   href={good.params.url}>Go to shop {good.params.shop.name}</a>
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