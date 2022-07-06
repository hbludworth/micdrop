import { loadStripe } from '@stripe/stripe-js';

const getStripe = async () => {
  const stripe = await loadStripe(
    process.env.NODE_ENV === 'production'
      ? 'pk_live_51LBV5ABD1AUOs1O82Z6FSNyCZdYhyMy5Mcpgnj6C7ny04uRNjW8SXllWj98794q2mfIu336wkMScD5lR4syJvn1N00RyLSiTWW'
      : 'pk_test_51LBV5ABD1AUOs1O8QKgG5GKTTPDDCy9d5iV0YUCMIhW5pXKGi570oQpjBFTlAz5WI3SDpuCv4Tzo0X9mqLd5HB9u00OqmTAvvq'
  );
  return stripe;
};

export default getStripe;
