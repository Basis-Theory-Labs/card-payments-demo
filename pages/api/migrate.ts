import { BasisTheory } from '@basis-theory/basis-theory-js';
import stripeData from 'stripe_migration_data.json';
import { ttl } from '@/components/utils';
import { ApiError } from '@/server/ApiError';
import { findCheckouts, updateCheckouts } from '@/server/db';
import { apiWithSession } from '@/server/session';

const migrateApi = apiWithSession(async (req, res, session) => {
  if (req.method !== 'POST') {
    throw new ApiError(404);
  }

  // initializes SDK with the API key
  const bt = await new BasisTheory().init(session.privateApiKey);

  // gets all Stripe "card on file" tokens
  const stripeCardTokens = stripeData.customers.reduce(
    (cardTokens, customer) => [
      ...cardTokens,
      ...customer.cards.map((card) => card.id),
    ],
    [] as string[]
  );

  const checkouts = findCheckouts(session.id, {
    paymentToken: {
      $in: stripeCardTokens,
    },
    tokenized: {
      $ne: true,
    },
  });

  if (checkouts.length) {
    const payload = stripeData.customers.reduce((allTokens, customer) => {
      const customerTokens = customer.cards.map(
        ({ id: cardId, number, name, exp_month, exp_year, ...address }) => ({
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

      return [...allTokens, ...customerTokens];
    }, [] as any[]);

    const tokens = await bt.tokenize(payload);

    updateCheckouts(
      checkouts.map((checkout, index) => ({
        ...checkout,
        paymentToken: (tokens as any)[index].id,
        tokenized: true,
      }))
    );
  }

  res.status(200).end();
});

export default migrateApi;
