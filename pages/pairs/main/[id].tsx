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
                <label htmlFor="marginLimit">Лимит маржи</label>
                <input
                  name="marginLimit"
                  id="marginLimit"
                  {...register('marginLimit', {
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
                <label htmlFor="buyPercent">Процент покупки</label>
                <input
                  name="buyPercent"
                  id="buyPercent"
                  {...register('buyPercent', {
                    required: true,
                    valueAsNumber: true,
                  })}
                  type="number"
                  className="validate"
                />
              </Field>
              <Field>
                <label htmlFor="buyMorePercent">Процент докупания</label>
                <input
                  name="buyMorePercent"
                  id="buyMorePercent"
                  {...register('buyMorePercent', {
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
                <label htmlFor="sellLongNotification">
                  Sell Long Notification
                </label>
                <input
                  name="sellLongNotification"
                  id="sellLongNotification"
                  {...register('sellLongNotification')}
                  type="checkbox"
                  className="validate"
                />
              </Field>
              <Field>
                <label htmlFor="buyMoreLongNotification">
                  Buy More Long Notification
                </label>
                <input
                  name="buyMoreLongNotification"
                  id="buyMoreLongNotification"
                  {...register('buyMoreLongNotification')}
                  type="checkbox"
                  className="validate"
                />
              </Field>
              <Field>
                <label htmlFor="buyLongNotification">
                  Buy Long Notification
                </label>
                <input
                  name="buyLongNotification"
                  id="buyLongNotification"
                  {...register('buyLongNotification')}
                  type="checkbox"
                  className="validate"
                />
              </Field>
              <Field>
                <label htmlFor="sellShortNotification">
                  Sell Short Notification
                </label>
                <input
                  name="sellShortNotification"
                  id="sellShortNotification"
                  {...register('sellShortNotification')}
                  type="checkbox"
                  className="validate"
                />
              </Field>
              <Field>
                <label htmlFor="buyMoreShortNotification">
                  Buy More Short Notification
                </label>
                <input
                  name="buyMoreShortNotification"
                  id="buyMoreShortNotification"
                  {...register('buyMoreShortNotification')}
                  type="checkbox"
                  className="validate"
                />
              </Field>
              <Field>
                <label htmlFor="buyShortNotification">
                  Buy Short Notification
                </label>
                <input
                  name="buyShortNotification"
                  id="buyShortNotification"
                  {...register('buyShortNotification')}
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
