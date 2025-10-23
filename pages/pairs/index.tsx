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
  const [allData, setAllData] = useState(false);
  const [onlyPrice, setOnlyPrice] = useState(false);
  const router = useRouter();
  const { withSettings } = router.query;
  const liquidationPercent = 97;

  const transformPairs = (pairsData: IPair[]): any => {
    return pairsData.map((pairData) => {
      const longLeveragePercent = pairData.longPercent.toFixed(2);
      const shortLeveragePercent = pairData.shortPercent.toFixed(2);
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
      const transformedData: IPair[] = transformPairs(
        data.sort((a, b) => a.order - b.order),
      );
      setPairs(transformedData);
    } catch (e) {}
  }, [request]);

  const deletePair = async (deletePairId) => {
    await request<IPair>(`/scanprices/pairs/${deletePairId}`, 'DELETE');
    fetchPairs();
  };

  const tableHeads = [
    <div>
      Name&nbsp;
      <input
        checked={allData}
        type="checkbox"
        onChange={() => setAllData((prevState) => !prevState)}
      />
    </div>,
    <div>
      L|S&nbsp;Percent&nbsp;
      <input
        checked={onlyPrice}
        type="checkbox"
        onChange={() => setOnlyPrice((prevState) => !prevState)}
      />
    </div>,
    'L|S Next',
    // 'L|S Step',
    'Price',
    // 'L|S Critical',
    'L|S Liquidation',
    'L|S Sell',
    'L|S Margin',
  ];

  const tableBody =
    pairs &&
    pairs
      .filter((pair) => {
        if (allData) {
          return (
            pair.longPercent > 2 ||
            pair.shortPercent > 2 ||
            pair.nextBuyLongPriceWarning ||
            pair.nextBuyShortPriceWarning ||
            !pair.autoAddLongMargin ||
            !pair.autoAddShortMargin ||
            pair?.longLiquidatePercent > liquidationPercent ||
            pair?.shortLiquidatePercent > liquidationPercent
          );
        }

        if (onlyPrice) {
          return pair.longPercent > 5 || pair.shortPercent > 5;
        }

        return true;
      })
      .map((pair) => {
        const bybitLink = `https://www.bybit.com/trade/usdt/${pair.symbol}`;
        const mexcLink = `https://futures.mexc.com/ru-RU/exchange/${pair.contract}`;

        const body = [
          <div>
            <a
              className="link"
              target="_blank"
              rel="noreferrer"
              href={pair.exchange === 'MEXC' ? mexcLink : bybitLink}
            >
              ({pair.exchange.charAt(0)}) {pair.name}
            </a>
          </div>,
          <div>
            <span
              className={
                pair.longPercent > 0 ? 'text-green-500' : 'text-red-500'
              }
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
                pair?.nextBuyLongPriceWarning
                  ? 'text-red-500'
                  : 'text-green-500'
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
                pair?.nextBuyShortPriceWarning
                  ? 'text-red-500'
                  : 'text-green-500'
              }
            >
              {pair?.nextBuyShortPrice}
            </span>
            {pair?.nextBuyShortPriceWarning &&
              pair?.currentPrice > pair?.nextBuyShortPrice && (
                <span className="text-red-500">*</span>
              )}
          </div>,
          // <div>
          //   {pair.longMarginStep}
          //   <span className="text-xs"> ({pair?.buyLongCoefficient})</span>
          //   &nbsp;|&nbsp;{pair.shortMarginStep}
          //   <span className="text-xs"> ({pair?.buyShortCoefficient})</span>
          // </div>,
          <div>
            {pair.currentPrice}{' '}
            <span className="text-xs"> ({pair?.ordersCount})</span>
          </div>,

          <div>
            <span
              className={
                pair?.longLiquidatePercent > liquidationPercent
                  ? 'text-red-500'
                  : 'text-green-500'
              }
            >
              {pair?.longLiquidatePercent}
            </span>
            {!pair?.autoAddLongMargin && (
              <span className="text-red-500">*</span>
            )}
            {pair?.longLiquidatePrice > pair?.nextBuyLongPrice &&
              !pair?.autoAddLongMargin && (
                <span className="text-red-500 text-2xl">WARNING</span>
              )}
            &nbsp;|&nbsp;
            <span
              className={
                pair?.shortLiquidatePercent > liquidationPercent
                  ? 'text-red-500'
                  : 'text-green-500'
              }
            >
              {pair?.shortLiquidatePercent}
            </span>
            {!pair?.autoAddShortMargin && (
              <span className="text-red-500">*</span>
            )}
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
              {pair.longMarginLimit} / {pair.shortMarginLimit}
            </div>,
          );
          body.push(
            <div>
              {pair.buyLongCoefficient} / {pair.buyShortCoefficient}
            </div>,
          );
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
    tableHeads.push('L|S Margin Limit');
    tableHeads.push('L|S Buy Coefficient');
    tableHeads.push('Set');
  }

  useEffect(() => {
    fetchPairs();
  }, []);

  useEffect(() => {
    setAllData(router.query?.allData === 'true');
  }, [router.query?.allData]);

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

      <Table
        style={{
          background: '#d7dae061',
        }}
        headings={tableHeads}
        tableBody={tableBody}
      />
    </>
  );
}

Pairs.getLayout = function getLayout(page) {
  return page;
};
