/* eslint-disable no-underscore-dangle */
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useHttp } from '../../hooks/http.hook';
import { BlockContent } from '../../components/BlockContent';
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

  const getLongColor = (pair: IPair) => {
    if (pair.longPercent > 0) {
      if (pair.longPercent > pair.leverage * pair.sellPercent)
        return 'text-green-500 font-bold text-2xl';
    } else {
      if (
        pair.longPercent < -pair.leverage * pair.buyPercent &&
        pair.longMargin < pair.marginLimit
      )
        return 'text-red-500 text-2xl';
      if (
        pair.longPercent < -pair.leverage * pair.buyPercent &&
        pair.longMargin > pair.marginLimit
      )
        return 'text-red-500 font-bold';
      if (
        pair.longPercent < -pair.leverage * pair.buyMorePercent &&
        pair.longMargin + pair.marginDifference < pair.shortMargin &&
        pair.longMargin + pair.marginDifference < pair.marginLimit
      )
        return 'text-yellow-500 text-2xl';
    }

    return 'text-xl';
  };

  const getShortColor = (pair: IPair) => {
    if (pair.shortPercent > 0) {
      if (pair.shortPercent > pair.leverage * pair.sellPercent)
        return 'text-green-500 font-bold text-2xl';
    } else {
      if (
        pair.shortPercent < -pair.leverage * pair.buyPercent &&
        pair.shortMargin < pair.marginLimit
      )
        return 'text-red-500 text-2xl';
      if (
        pair.shortPercent < -pair.leverage * pair.buyPercent &&
        pair.shortMargin > pair.marginLimit
      )
        return 'text-red-500 font-bold';
      if (
        pair.shortPercent < -pair.leverage * pair.buyMorePercent &&
        pair.shortMargin + pair.marginDifference < pair.longMargin &&
        pair.shortMargin + pair.marginDifference < pair.marginLimit
      )
        return 'text-yellow-500 text-2xl';
    }

    return 'text-xl';
  };

  const transformPairs = (pairsData: IPair[]) => {
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
    'Link',
    'Current price',
    'Long Margin',
    'Short Margin',
    'Long Percent',
    'Short Percent',
  ];
  const tableBody =
    pairs &&
    pairs.map((pair) => {
      return [
        <div>
          <Link href={`/pairs/${pair._id}`}>
            <a className="link">{pair.name}</a>
          </Link>
          (
          <Link href={`/pairs/main/${pair._id}`}>
            <a className="link">settings</a>
          </Link>
          )
        </div>,
        <a
          className="link"
          target="_blank"
          rel="noreferrer"
          href={`https://futures.mexc.com/ru-RU/exchange/${pair.contract}`}
        >
          MEXC
        </a>,
        <div>${pair.currentPrice}</div>,
        <div>{convertPrice(pair.longMargin, 'USD')}</div>,
        <div>{convertPrice(pair.shortMargin, 'USD')}</div>,
        <div className={getLongColor(pair)}>{pair.longPercent}%</div>,
        <div className={getShortColor(pair)}>{pair.shortPercent}%</div>,
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
      <BlockContent>
        <Table headings={tableHeads} tableBody={tableBody} />
      </BlockContent>
    </>
  );
}

Pairs.getLayout = function getLayout(page) {
  return page;
};
