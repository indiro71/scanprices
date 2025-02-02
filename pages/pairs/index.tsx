/* eslint-disable no-underscore-dangle */
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import copy from 'copy-to-clipboard';
import { useRouter } from 'next/router';
import { useHttp } from '../../hooks/http.hook';
import { IPair } from '../../types/pair';
import { Table } from '../../components/Table';

export default function Pairs(): JSX.Element {
  const { request } = useHttp();
  const [pairs, setPairs] = useState<IPair[]>([]);
  const router = useRouter();
  const { withSettings } = router.query;

  const getPercent = (currentPrice, savingPrice, isShort?: boolean) => {
    const percent = (currentPrice / savingPrice) * 100 - 100;
    return isShort ? -percent : percent;
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
      setPairs(transformPairs(data.sort((a, b) => a.order - b.order)));
    } catch (e) {}
  }, [request]);

  const deletePair = async (deletePairId) => {
    await request<IPair>(`/scanprices/pairs/${deletePairId}`, 'DELETE');
    fetchPairs();
  };

  const tableHeads = [
    'Name',
    'Long | Short Percent',
    'Long | Short Next',
    'Price',
    // 'Long | Short Critical',
    'Long | Short Liquidation',
    'Long | Short Sell',
    'Long | Short Margin',
  ];

  const tableBody =
    pairs &&
    pairs.map((pair) => {
      const body = [
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
        <div>
          <span
            className={pair.longPercent > 0 ? 'text-green-500' : 'text-red-500'}
          >
            {pair.longPercent || 'Add'}%
          </span>
          &nbsp;|&nbsp;
          <span
            className={
              pair.shortPercent > 0 ? 'text-green-500' : 'text-red-500'
            }
          >
            {pair.shortPercent || 'Add'}%
          </span>
        </div>,
        <div className="cursor-pointer">
          <span
            onClick={() => copy(`${pair?.nextBuyLongPrice}`)}
            className={
              pair?.nextBuyLongPriceWarning ? 'text-red-500' : 'text-green-500'
            }
          >
            {pair?.nextBuyLongPrice}
          </span>
          {pair?.nextBuyLongPriceWarning &&
            pair?.currentPrice < pair?.nextBuyLongPrice && (
              <span className="text-red-500">*</span>
            )}
          &nbsp;|&nbsp;
          <span
            onClick={() => copy(`${pair?.nextBuyShortPrice}`)}
            className={
              pair?.nextBuyShortPriceWarning ? 'text-red-500' : 'text-green-500'
            }
          >
            {pair?.nextBuyShortPrice}
          </span>
          {pair?.nextBuyShortPriceWarning &&
            pair?.currentPrice > pair?.nextBuyShortPrice && (
              <span className="text-red-500">*</span>
            )}
        </div>,
        <div>
          {pair.currentPrice}{' '}
          <span className="text-xs"> ({pair?.ordersCount})</span>
        </div>,

        <div>
          <span
            className={
              pair?.longLiquidatePrice > pair?.nextBuyLongPrice
                ? 'text-red-500'
                : 'text-green-500'
            }
          >
            {pair?.longLiquidatePrice}
          </span>
          {!pair?.autoAddLongMargin && <span className="text-red-500">*</span>}
          {pair?.longLiquidatePrice > pair?.nextBuyLongPrice &&
            !pair?.autoAddLongMargin && (
              <span className="text-red-500 text-2xl">WARNING</span>
            )}
          &nbsp;|&nbsp;
          <span
            className={
              pair?.shortLiquidatePrice < pair?.nextBuyShortPrice
                ? 'text-red-500'
                : 'text-green-500'
            }
          >
            {pair?.shortLiquidatePrice}
          </span>
          {!pair?.autoAddShortMargin && <span className="text-red-500">*</span>}
          {pair?.shortLiquidatePrice < pair?.nextBuyShortPrice &&
            !pair?.autoAddShortMargin && (
              <span className="text-red-500 text-2xl">WARNING</span>
            )}
        </div>,

        <div className="cursor-pointer">
          <span
            onClick={() => copy(`${pair?.sellLongPrice}`)}
            className={pair?.sellLongPriceWarning ? '' : 'text-green-500'}
          >
            {pair?.sellLongPrice}
          </span>
          &nbsp;|&nbsp;
          <span
            onClick={() => copy(`${pair?.sellShortPrice}`)}
            className={pair?.sellShortPriceWarning ? '' : 'text-green-500'}
          >
            {pair?.sellShortPrice}
          </span>
        </div>,

        <div>
          <span>
            {Math.round(pair.longMargin)}
            {pair.longAllMargin - pair.longMargin > 0 && (
              <span className="text-xs">
                ({Math.round(pair.longAllMargin - pair.longMargin)})
              </span>
            )}
          </span>{' '}
          |{' '}
          <span>
            {Math.round(pair.shortMargin)}{' '}
            {pair.shortAllMargin - pair.shortMargin > 0 && (
              <span className="text-xs">
                ({Math.round(pair.shortAllMargin - pair.shortMargin)})
              </span>
            )}
          </span>
        </div>,
      ];

      if (withSettings === 'true') {
        body.push(
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
        );
      }
      return body;
    });

  if (withSettings === 'true') {
    tableHeads.push('Set');
  }

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
