import { BasisTheory } from '@basis-theory/basis-theory-js';
import { BasisTheoryApiError } from '@basis-theory/basis-theory-js/common';
import { ttl } from '@/components/utils';
import { ApiError } from '@/server/ApiError';
import { findCheckouts, updateCheckouts } from '@/server/db';
import { apiWithSession } from '@/server/session';
import { readStripeCards } from '@/server/utils';

const migrateApi = apiWithSession(async (req, res, session) => {
  if (req.method !== 'POST') {
    throw new ApiError(404);
  }

  // initializes SDK with the API key
  const bt = await new BasisTheory().init(session.privateApiKey);

  // gets all Stripe "card-on-file" tokens
  const stripeCardTokens = readStripeCards();

  const checkouts = findCheckouts(session.id, {
    paymentToken: {
      $in: stripeCardTokens.map(({ id }) => id),
    },
    tokenized: {
      $ne: true,
    },
  });

  if (checkouts.length) {
    const payload = stripeCardTokens.map(
      ({
        id: cardId,
        number,
        name,
        exp_month,
        exp_year,
        customer,
        ...address
      }) => ({
        id: cardId, // uses Stripe token ID for Basis Theory Token ID
        type: 'card',
        data: {
          number,
          expiration_month: exp_month,
          expiration_year: exp_year,
        },
        metadata: {
          stripe_customer: customer.id,
          stripe_token: cardId,
          ...address,
        },
        expires_at: ttl(),
        deduplicate_token: true,
      })
    );

    try {
      await bt.tokenize(payload);
    } catch (error) {
      if (!(error instanceof BasisTheoryApiError) || error.status !== 409) {
        // tokens may have been migrated before in a different session
        throw error;
      }
    }
  }

  updateCheckouts(
    checkouts.map((checkout) => ({
      ...checkout,
      tokenized: true,
    }))
  );

  res.status(200).end();
});

export default migrateApi;
