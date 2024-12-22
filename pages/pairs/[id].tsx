/* eslint-disable react/jsx-props-no-spreading,jsx-a11y/label-has-associated-control,no-unsafe-optional-chaining */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { useHttp } from '../../hooks/http.hook';
import { BlockContent } from '../../components/BlockContent';
import { IPair } from '../../types/pair';
import { Field } from '../../components/form';

const DetailPairPage = ({ pairId }) => {
  const { request, loading } = useHttp();
  const [pair, setPair] = useState<IPair>();

  const { register, reset, handleSubmit } = useForm({
    defaultValues: useMemo(() => {
      return pair;
    }, [pair]),
  });

  const getPercent = (currentPrice, savingPrice, isShort?: boolean) => {
    const percent = (currentPrice / savingPrice) * 100 - 100;
    return isShort ? -percent : percent;
  };

  const fetchData = useCallback(async () => {
    try {
      const data = await request<IPair>(`/scanprices/pairs/${pairId}`, 'GET');
      setPair(data);
    } catch (e) {}
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setInterval(() => {
      fetchData();
    }, 5000);
  }, []);

  useEffect(() => {
    reset(pair);
  }, [pair]);

  return (
    <>
      <Head>
        <title>{pair?.name} - Scanprices</title>
      </Head>
      <BlockContent>
        <div className="flex gap-4 max-w-full">
          <div className="min-w-min">
            <div className="header-2">Стоимость</div>
            <form noValidate autoComplete="off">
              <Field>
                <label htmlFor="currentPrice">Текущая цена</label>
                <input
                  name="currentPrice"
                  id="currentPrice"
                  {...register('currentPrice', {
                    required: true,
                    valueAsNumber: true,
                  })}
                  type="number"
                  className="validate"
                />
              </Field>
              <Field>
                <label htmlFor="longPr">Процент лонга</label>
                <input
                  name="longPr"
                  value={(
                    getPercent(pair?.currentPrice, pair?.longPrice) *
                    pair?.leverage
                  ).toFixed(2)}
                  type="number"
                  className="validate"
                />
              </Field>
              <Field>
                <label htmlFor="shortPr">Процент шорта</label>
                <input
                  name="shortPr"
                  value={(
                    getPercent(pair?.currentPrice, pair?.shortPrice, true) *
                    pair?.leverage
                  ).toFixed(2)}
                  type="number"
                  className="validate"
                />
              </Field>
            </form>
          </div>

          <div className="min-w-min">
            <div className="header-2">Лонг</div>
            <form noValidate autoComplete="off">
              <Field>
                <label htmlFor="longPrice">Позиция лонга</label>
                <input
                  name="longPrice"
                  id="longPrice"
                  {...register('longPrice', {
                    required: true,
                    valueAsNumber: true,
                  })}
                  type="number"
                  className="validate"
                />
              </Field>
              <Field>
                <label htmlFor="longMargin">Маржа лонга</label>
                <input
                  name="longMargin"
                  id="longMargin"
                  {...register('longMargin', {
                    required: true,
                    valueAsNumber: true,
                  })}
                  type="number"
                  className="validate"
                />
              </Field>
            </form>
          </div>

          <div className="min-w-min">
            <div className="header-2">Шорт</div>
            <form noValidate autoComplete="off">
              <Field>
                <label htmlFor="shortPrice">Позиция шорта</label>
                <input
                  name="shortPrice"
                  id="shortPrice"
                  {...register('shortPrice', {
                    required: true,
                    valueAsNumber: true,
                  })}
                  type="number"
                  className="validate"
                />
              </Field>
              <Field>
                <label htmlFor="shortMargin">Маржа шорта</label>
                <input
                  name="shortMargin"
                  id="shortMargin"
                  {...register('shortMargin', {
                    required: true,
                    valueAsNumber: true,
                  })}
                  type="number"
                  className="validate"
                />
              </Field>
            </form>
          </div>
        </div>
      </BlockContent>
    </>
  );
};
export default DetailPairPage;

DetailPairPage.getLayout = function getLayout(page) {
  return page;
};

export const getServerSideProps = async ({ params }) => {
  return {
    props: {
      pairId: params.id,
    },
  };
};
