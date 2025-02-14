import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { Snackbar } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { useHttp } from '../../../hooks/http.hook';
import { BlockContent } from '../../../components/BlockContent';
import { IPair } from '../../../types/pair';
import { Button, Field } from '../../../components/form';

const DetailPairPage = ({ pairId }) => {
  const { request } = useHttp();
  const [pair, setPair] = useState<IPair>();

  const { register, reset, handleSubmit } = useForm({
    defaultValues: useMemo(() => {
      return pair;
    }, [pair]),
  });

  const [status, setStatus] = useState('');
  const [open, setOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const data = await request<IPair>(`/scanprices/pairs/${pairId}`, 'GET');
      setPair(data);
    } catch (e) {}
  }, []);

  const editPair = async (data) => {
    if (data.symbol) {
      try {
        await request(`/scanprices/pairs/${pairId}`, 'PUT', data);
        setStatus('Pair changed');
      } catch (e) {
        console.log(e);
      }
      setOpen(true);
    }
  };

  useEffect(() => {
    fetchData();
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
        <Snackbar open={open} message={status} />

        <div className="flex gap-4 max-w-full">
          <div className="min-w-min">
            <div className="header-2">Основная информация</div>
            <form
              onSubmit={handleSubmit(editPair)}
              noValidate
              autoComplete="off"
            >
              <Field>
                <label htmlFor="name">Название</label>
                <input
                  name="name"
                  id="name"
                  {...register('name', { required: true })}
                  type="text"
                  className="validate"
                />
              </Field>
              <Field>
                <label htmlFor="symbol">Код</label>
                <input
                  name="symbol"
                  id="symbol"
                  {...register('symbol', { required: true })}
                  type="text"
                  className="validate"
                />
              </Field>
              <Field>
                <label htmlFor="contract">Контракт</label>
                <input
                  name="contract"
                  id="contract"
                  {...register('contract', { required: true })}
                  type="text"
                  className="validate"
                />
              </Field>
              <Field>
                <label htmlFor="shortMarginLimit">Лимит маржи шорта</label>
                <input
                  name="shortMarginLimit"
                  id="shortMarginLimit"
                  {...register('shortMarginLimit', {
                    required: true,
                    valueAsNumber: true,
                  })}
                  type="number"
                  className="validate"
                />
              </Field>
              <Field>
                <label htmlFor="longMarginLimit">Лимит маржи лонга</label>
                <input
                  name="longMarginLimit"
                  id="longMarginLimit"
                  {...register('longMarginLimit', {
                    required: true,
                    valueAsNumber: true,
                  })}
                  type="number"
                  className="validate"
                />
              </Field>
              <Field>
                <label htmlFor="shortMarginStep">Шаг маржи шорта</label>
                <input
                  name="shortMarginStep"
                  id="shortMarginStep"
                  {...register('shortMarginStep', {
                    required: true,
                    valueAsNumber: true,
                  })}
                  type="number"
                  className="validate"
                />
              </Field>
              <Field>
                <label htmlFor="longMarginStep">Шаг маржи лонга</label>
                <input
                  name="longMarginStep"
                  id="longMarginStep"
                  {...register('longMarginStep', {
                    required: true,
                    valueAsNumber: true,
                  })}
                  type="number"
                  className="validate"
                />
              </Field>
              <Field>
                <label htmlFor="marginDifference">Разница маржи</label>
                <input
                  name="marginDifference"
                  id="marginDifference"
                  {...register('marginDifference', {
                    required: true,
                    valueAsNumber: true,
                  })}
                  type="number"
                  className="validate"
                />
              </Field>
              <Field>
                <label htmlFor="leverage">Плечо</label>
                <input
                  name="leverage"
                  id="leverage"
                  {...register('leverage', {
                    required: true,
                    valueAsNumber: true,
                  })}
                  type="number"
                  className="validate"
                />
              </Field>
              <Field>
                <label htmlFor="sellPercent">Процент продажи</label>
                <input
                  name="sellPercent"
                  id="sellPercent"
                  {...register('sellPercent', {
                    required: true,
                    valueAsNumber: true,
                  })}
                  type="number"
                  className="validate"
                />
              </Field>
              <Field>
                <label htmlFor="buyCoefficient">
                  Коэффициент покупки лонга
                </label>
                <input
                  name="buyLongCoefficient"
                  id="buyLongCoefficient"
                  {...register('buyLongCoefficient', {
                    required: true,
                    valueAsNumber: true,
                  })}
                  type="number"
                  className="validate"
                />
              </Field>
              <Field>
                <label htmlFor="buyCoefficient">
                  Коэффициент покупки шорта
                </label>
                <input
                  name="buyShortCoefficient"
                  id="buyShortCoefficient"
                  {...register('buyShortCoefficient', {
                    required: true,
                    valueAsNumber: true,
                  })}
                  type="number"
                  className="validate"
                />
              </Field>
              <Field>
                <label htmlFor="round">Количество знаков округления</label>
                <input
                  name="round"
                  id="round"
                  {...register('round', {
                    required: true,
                    valueAsNumber: true,
                  })}
                  type="number"
                  className="validate"
                />
              </Field>
              <Field>
                <label htmlFor="order">Сортировка</label>
                <input
                  name="order"
                  id="order"
                  {...register('order', {
                    required: true,
                    valueAsNumber: true,
                  })}
                  type="number"
                  className="validate"
                />
              </Field>
              <Field>
                <label htmlFor="isActive">Активно</label>
                <input
                  name="isActive"
                  id="isActive"
                  {...register('isActive')}
                  type="checkbox"
                  className="validate"
                />
              </Field>

              <Field>
                <label htmlFor="sendNotification">Send Notification</label>
                <input
                  name="sendNotification"
                  id="sendNotification"
                  {...register('sendNotification')}
                  type="checkbox"
                  className="validate"
                />
              </Field>
              <Field>
                <label htmlFor="notificationSending">
                  Notification Sending
                </label>
                <input
                  name="notificationSending"
                  id="notificationSending"
                  {...register('notificationSending')}
                  type="checkbox"
                  className="validate"
                />
              </Field>
              <Button type="submit" label="Edit" name="action" />
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
