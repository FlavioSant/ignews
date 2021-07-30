import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import { stripe } from '../services/stripe';

import { SubscribeButton } from '../components/SubscribeButton';

import avatarImg from '../../public/images/avatar.svg';

import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

const Home: NextPage<HomeProps> = ({ product }) => {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👋 Hey, welcome</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>

        <Image src={avatarImg} alt="Girl coding" />
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ctx => {
  const price = await stripe.prices.retrieve('price_1JIa2XJMQvlvPLLcwdRaZBvU');

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};

export default Home;
