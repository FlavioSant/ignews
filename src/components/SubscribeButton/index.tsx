import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe.js';

import styles from './styles.module.scss';

interface SubscribeButtonProps {
  priceId: string;
}

export const SubscribeButton: React.FC<SubscribeButtonProps> = ({
  priceId,
}) => {
  const [session] = useSession();
  const router = useRouter();

  const handleSubscribe = useCallback(async () => {
    if (!session) {
      signIn('github');
      return;
    }

    if (session.activeSubscription) {
      router.push('/posts');
      return;
    }

    try {
      const { data } = await api.post('/subscribe');

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (err) {
      alert(err.message);
    }
  }, [session, router]);

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe Now
    </button>
  );
};
