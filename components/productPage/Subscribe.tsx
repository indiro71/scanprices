import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Field } from '../form';
import { useHttp } from '../../hooks/http.hook';
import { convertPrice } from '../../helpers';
import { ISubscribe } from '../../types/subscribe';
import { Loader } from '../loader/Loader';

interface SubscribeProps {
  productId: string;
}

export const Subscribe: FC<SubscribeProps> = ({ productId }) => {
  const { request, loading } = useHttp();
  const [editAlertPrice, setEditAlertPrice] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>();
  const [sub, setSub] = useState<ISubscribe>();

  const fetchSubscribe = useCallback(async () => {
    if (!productId) return;
    try {
      const subscribe = await request<ISubscribe>(
        `/scanprices/subscribe/${productId}`,
        'GET',
      );
      setSub(subscribe);
    } catch (e) {}
  }, [productId]);

  useEffect(() => {
    fetchSubscribe();
  }, []);

  const fetchUnSubscribe = useCallback(async () => {
    try {
      await request(`/scanprices/subscribe/${productId}`, 'DELETE');
      setEditAlertPrice(false);
      setSub(null);
    } catch (e) {}
  }, [productId]);

  const editSubscribe = useCallback(async () => {
    if (!inputRef.current?.value) return;

    try {
      const subscribe = await request<ISubscribe>(
        `/scanprices/subscribe/`,
        'POST',
        {
          price: inputRef.current?.value,
          product: productId,
        },
      );
      setEditAlertPrice(false);
      setSub(subscribe);
    } catch (e) {}
  }, [productId]);

  useEffect(() => {
    const onKeypress = (e) => {
      if (e.code === 'Enter' && inputRef.current?.value) {
        editSubscribe();
      }
    };
    document.addEventListener('keypress', onKeypress);

    return () => {
      document.removeEventListener('keypress', onKeypress);
    };
  }, [productId]);

  if (loading) {
    return <Loader visible={loading} />;
  }

  return (
    <div>
      {sub ? (
        <div className="flex items-center">
          <p className="mr-3">Alert price: </p>
          {!editAlertPrice && (
            <p
              className="cursor-pointer"
              onClick={() => setEditAlertPrice(true)}
            >
              {convertPrice(sub.price)}
            </p>
          )}
          {editAlertPrice && (
            <div className="flex items-center">
              <Field>
                <input
                  autoFocus
                  ref={inputRef}
                  name="alertPrice"
                  id="alertPrice"
                  defaultValue={sub.price}
                  type="text"
                />
              </Field>
              <p
                onClick={() => setEditAlertPrice(false)}
                className="text-blue-600 cursor-pointer ml-3 hover:underline"
              >
                Cancel
              </p>
            </div>
          )}
          {!editAlertPrice && (
            <p
              onClick={() => fetchUnSubscribe()}
              className="ml-3 text-blue-600 cursor-pointer underline text-sm hover:underline"
            >
              Unsubscribe
            </p>
          )}
        </div>
      ) : (
        <div>
          {!editAlertPrice && (
            <p
              onClick={() => setEditAlertPrice(true)}
              className="text-blue-600 cursor-pointer"
            >
              Subscribe on alert min price
            </p>
          )}
          {editAlertPrice && (
            <div className="flex items-center">
              <Field>
                <input
                  autoFocus
                  ref={inputRef}
                  name="alertPrice"
                  id="alertPrice"
                  type="text"
                />
              </Field>
              <p
                onClick={() => editSubscribe()}
                className="text-blue-600 cursor-pointer ml-3 hover:underline"
              >
                Save
              </p>
              <p
                onClick={() => setEditAlertPrice(false)}
                className="text-blue-600 cursor-pointer ml-3 hover:underline"
              >
                Cancel
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
