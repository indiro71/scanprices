import Head from 'next/head';
import { BlockContent } from '../components/BlockContent';
import { LastAddedProducts, LastUpdatedProducts } from '../components/homePage';

export default function Home(): JSX.Element {
  return (
    <>
      <Head>
        <title>Main page - Scanprices</title>
      </Head>
      <BlockContent>
        <LastAddedProducts/>
        <LastUpdatedProducts/>
      </BlockContent>
    </>
  );
}
