import React, { FC } from 'react';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import { IPrice } from '../../types/price';

interface ChartProps {
  prices: IPrice[];
}

const options = {
  maintainAspectRatio: false,
  responsive: true,
  title: {
    display: true,
    text: 'Changes in product prices',
  },
  tooltips: {
    mode: 'index',
    intersect: false,
  },
  hover: {
    mode: 'nearest',
    intersect: true,
  },
  scales: {
    xAxes: [
      {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Date',
        },
      },
    ],
    yAxes: [
      {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Price',
        },
      },
    ],
  },
};

export const Chart: FC<ChartProps> = ({ prices }) => {
  const dataChart = {
    labels: prices
      ? prices.map((price) => moment(price.date).format('DD MM YYYY'))
      : '',
    datasets: [
      {
        label: 'Product price',
        backgroundColor: '#ffffff',
        borderColor: '#000000',
        data: prices ? prices.map((price) => price.price) : '',
        fill: false,
      },
    ],
  };

  return <Line data={dataChart} options={options} height={400} type="line" />;
};
