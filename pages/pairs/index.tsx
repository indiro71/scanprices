/* eslint-disable no-underscore-dangle */
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useHttp } from '../../hooks/http.hook';
import { IPair } from '../../types/pair';
import { Table } from '../../components/Table';
import { convertPrice } from '../../helpers';

export default function Pairs(): JSX.Element {
  const { request } = useHttp();
  const [pairs, setPairs] = useState<IPair[]>([]);

  const getPercent = (currentPrice, savingPrice, isShort?: boolean) => {
    const percent = (currentPrice / savingPrice) * 100 - 100;
    return isShort ? -percent : percent;
  };

  const buyMoreCoefficient = 1;
  const buyCoefficient = 0.25;

  const getLongColor = (pair: IPair) => {
    const colorParts = [];
    const correctionBuyMoreLongPercent =
      Math.floor(pair.longMargin / pair.marginStep) * buyMoreCoefficient;
    const correctionBuyLongPercent =
      Math.floor(pair.longMargin / pair.marginStep) * buyCoefficient;
    if (pair.longPercent > 0) {
      colorParts.push('text-green-500');
      if (pair.longPercent > pair.leverage && pair.longMargin < pair.marginStep)
        colorParts.push('text-yellow-500 text-xl');
      if (pair.longPercent > pair.leverage * pair.sellPercent)
        colorParts.push('font-bold text-xl');
    } else {
      colorParts.push('text-red-500');
      if (
        pair.longPercent <
          -pair.leverage * (pair.buyPercent + correctionBuyLongPercent) &&
        pair.longMargin < pair.marginLimit
      )
        colorParts.push('text-xl');
      if (
        pair.longPercent < -pair.leverage * pair.buyPercent &&
        pair.longMargin > pair.marginLimit
      )
        colorParts.push('');
      if (
        pair.longPercent <
          -pair.leverage *
            (pair.buyMorePercent + correctionBuyMoreLongPercent) &&
        pair.longMargin + pair.marginDifference < pair.shortMargin &&
        pair.longMargin + pair.marginDifference < pair.marginLimit
      )
        colorParts.push('text-yellow-500 text-xl');
    }

    return colorParts.join(' ');
  };

  const getShortColor = (pair: IPair) => {
    const colorParts = [];
    const correctionBuyMoreShortPercent =
      Math.floor(pair.shortMargin / pair.marginStep) * buyMoreCoefficient;
    const correctionBuyShortPercent =
      Math.floor(pair.shortMargin / pair.marginStep) * buyCoefficient;
    if (pair.shortPercent > 0) {
      colorParts.push('text-green-500');
      if (
        pair.shortPercent > pair.leverage &&
        pair.shortMargin < pair.marginStep
      )
        colorParts.push('text-yellow-500 text-xl');
      if (pair.shortPercent > pair.leverage * pair.sellPercent)
        colorParts.push('font-bold text-xl');
    } else {
      colorParts.push('text-red-500');
      if (
        pair.shortPercent <
          -pair.leverage * (pair.buyPercent + correctionBuyShortPercent) &&
        pair.shortMargin < pair.marginLimit
      )
        colorParts.push('text-xl');
      if (
        pair.shortPercent < -pair.leverage * pair.buyPercent &&
        pair.shortMargin > pair.marginLimit
      )
        colorParts.push('');
      if (
        pair.shortPercent <
          -pair.leverage *
            (pair.buyMorePercent + correctionBuyMoreShortPercent) &&
        pair.shortMargin + pair.marginDifference < pair.longMargin &&
        pair.shortMargin + pair.marginDifference < pair.marginLimit
      )
        colorParts.push('text-yellow-500 text-xl');
    }

    return colorParts.join(' ');
  };

  const transformPairs = (pairsData: IPair[]): any => {
    return pairsData.map((pairData) => {
      const longPercent = getPercent(pairData.currentPrice, pairData.longPrice);
      const longLeveragePercent = (longPercent * pairData.leverage).toFixed(2);
      const shortPercent = getPercent(
        pairData.currentPrice,
        pairData.shortPrice,
        true,
      );
      const shortLeveragePercent = (shortPercent * pairData.leverage).toFixed(
        2,
      );
      return {
        ...pairData,
        longPercent: longLeveragePercent,
        shortPercent: shortLeveragePercent,
      };
    });
  };

  const fetchPairs = useCallback(async () => {
    try {
      const data = await request<IPair[]>(`/scanprices/pairs/`, 'GET');
      setPairs(transformPairs(data));
    } catch (e) {}
  }, [request]);

  const deletePair = async (deletePairId) => {
    await request<IPair>(`/scanprices/pairs/${deletePairId}`, 'DELETE');
    fetchPairs();
  };

  const tableHeads = [
    'Name',
    'Long Percent',
    'Short Percent',
    'Step',
    'Current price',
    'Long Margin',
    'Short Margin',
    'Set',
  ];
  const tableBody =
    pairs &&
    pairs.map((pair) => {
      return [
        <div>
          <a
            className="link"
            target="_blank"
            rel="noreferrer"
            href={`https://futures.mexc.com/ru-RU/exchange/${pair.contract}`}
          >
            {pair.name}
          </a>
        </div>,
        <div className={getLongColor(pair)}>{pair.longPercent}%</div>,
        <div className={getShortColor(pair)}>{pair.shortPercent}%</div>,
        <div>${pair.marginStep}</div>,
        <div>${pair.currentPrice}</div>,
        <div>{convertPrice(pair.longMargin, 'USD')}</div>,
        <div>{convertPrice(pair.shortMargin, 'USD')}</div>,
        <div>
          <Link href={`/pairs/${pair._id}`}>
            <a className="link">IF</a>
          </Link>
          (
          <Link href={`/pairs/main/${pair._id}`}>
            <a className="link">SET</a>
          </Link>
          )
        </div>,
      ];
    });

  useEffect(() => {
    fetchPairs();
  }, []);

  useEffect(() => {
    setInterval(() => {
      fetchPairs();
    }, 5000);
  }, []);

  return (
    <>
      <Head>
        <title>Pairs - Scanprices</title>
      </Head>
      <Table headings={tableHeads} tableBody={tableBody} />
    </>
  );
}

Pairs.getLayout = function getLayout(page) {
  return page;
};
