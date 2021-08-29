import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
  useRef,
} from 'react';
import { useHttp } from '../../hooks/http.hook';
import { BlockContent } from '../../components/BlockContent';
import Head from 'next/head';
import moment from 'moment';
import { Loader } from '../../components/loader/Loader';
import { convertPrice } from '../../helpers';
import { IProduct } from '../../types/product';
import { IPrice } from '../../types/price';
import { Chart, Subscribe } from '../../components/productPage';

interface ProductData {
  product: IProduct;
  prices: IPrice[];
}

const DetailProductPage = ({ productId }) => {
  const { request, loading } = useHttp();
  const [data, setData] = useState<ProductData>();
  const [diffPrice, setDiffPrice] = useState<number>(0);

  const fetchData = useCallback(async () => {
    try {
      const data = await request<ProductData>(
        `/scanprices/products/${productId}`,
        'GET',
      );
      setData(data);
      setDiffPrice(data.prices[data.prices.length - 2].price);
    } catch (e) {}
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const reversedPrices = useMemo(() => {
    if (!data) return;
    const { prices } = data;
    if (!prices) return;
    const allPrices = [];
    const revPrices = [];
    for (let i = prices.length; i !== 0; i--) {
      if (prices[i - 1]?.price && !allPrices.includes(prices[i - 1]?.price)) {
        allPrices.push(prices[i - 1].price);
        revPrices.push(prices[i - 1]);
      }
    }
    return revPrices.reverse();
  }, [data]);

  return (
    <>
      <Head>
        <title>{data?.product?.name} - Scanprices</title>
      </Head>
      <BlockContent>
        {loading && <Loader visible={loading} />}
        {data?.product && !loading ? (
          <div>
            <div className="header-2">{data.product.name}</div>

            <div className="flex w-full ">
              <div className="w-1/4 mx-5 p-4 shadow-lg rounded-2xl bg-white">
                <img
                  className="max-w-full"
                  alt={data.product.name}
                  src={`${process.env.NEXT_PUBLIC_REACT_APP_STORAGE_SERVER}/images/${data.product.image}`}
                />
              </div>

              <div className="w-3/4 mx-5 p-4 shadow-lg rounded-2xl bg-white h-full">
                <div className="w-full flex justify-center mb-3">
                  <div className="w-1/2 mx-3 text-center">
                    <p>
                      <b>Date created: </b>
                    </p>
                    <p>
                      {moment(data.product.dateCreate).format(
                        'DD-MM-YYYY, HH:mm:ss',
                      )}
                    </p>
                  </div>
                  <div className="w-1/2 mx-3 text-center">
                    <p>
                      <b>Date updated: </b>
                    </p>
                    <p>
                      {moment(data.product.dateUpdate).format(
                        'DD-MM-YYYY, HH:mm:ss',
                      )}
                    </p>
                  </div>
                </div>

                <div className="w-full flex justify-center mb-3 border-b border-gray-200 pb-6">
                  <div className="w-1/3 mx-3 text-center">
                    <p>
                      <b>Current price: </b>
                    </p>
                    <p>{convertPrice(data.product.currentPrice)} </p>
                    <p>
                      {data.product.currentPrice > diffPrice ? (
                        <span className="text-red-500">
                          +{' '}
                          {convertPrice(data.product.currentPrice - diffPrice)}
                        </span>
                      ) : (
                        <span className="text-green-500">
                          {convertPrice(data.product.currentPrice - diffPrice)}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="w-1/3 mx-3 text-center">
                    <p>
                      <b>Maximum price: </b>
                    </p>
                    <p>{convertPrice(data.product.maxPrice)} </p>
                    <p>
                      <span className="text-green-500">
                        -{' '}
                        {convertPrice(
                          data.product.maxPrice - data.product.currentPrice,
                        )}
                      </span>
                    </p>
                  </div>
                  <div className="w-1/3 mx-3 text-center">
                    <p>
                      <b>Minimum price: </b>
                    </p>
                    <p>{convertPrice(data.product.minPrice)} </p>
                    <p>
                      <span className="text-red-500">
                        +{' '}
                        {convertPrice(
                          data.product.currentPrice - data.product.minPrice,
                        )}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="w-full flex items-center justify-between">
                  {/*<a href="#">Delete</a>*/}
                  {/*<a href="#">Edit</a>*/}
                  <a
                    className="link uppercase px-3 mr-3"
                    target="_blank"
                    rel="noreferrer"
                    href={data.product.url}
                  >
                    Go to shop {data.product.shop.name}
                  </a>
                  <Subscribe productId={productId} />
                </div>
              </div>
            </div>

            <div className="mx-5 mt-5 p-4 shadow-lg rounded-2xl bg-white">
              <Chart prices={reversedPrices} />
            </div>
          </div>
        ) : null}
      </BlockContent>
    </>
  );
};
export default DetailProductPage;

export const getServerSideProps = async ({ params }) => {
  return {
    props: {
      productId: params.id,
    },
  };
};
