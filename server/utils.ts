import { BasisTheory } from '@basis-theory/basis-theory-js';
import { BasisTheoryApiError } from '@basis-theory/basis-theory-js/common';
import crypto from 'crypto';
import stripeData from 'stripe_migration_data.json';

const randomHex = (size = 20) => crypto.randomBytes(size).toString('hex');

type StripeCustomer = typeof stripeData.customers[number];
type StripeCard = StripeCustomer['cards'][number];
type StripeCardWithCustomer = StripeCard & {
  customer: StripeCustomer;
};

const readStripeCards = (): StripeCardWithCustomer[] =>
  stripeData.customers.reduce(
    (cards, customer) => [
      ...cards,
      ...customer.cards.map((card) => ({
        ...card,
        customer,
      })),
    ],
    [] as StripeCardWithCustomer[]
  );

/**
 * Deletes previously stored migration tokens
 * to avoid token id conflict when performing migration
 */
const cleanupMigrationTokens = async (privateApiKey: string) => {
  const bt = await new BasisTheory().init(privateApiKey);

  const promises = readStripeCards().map((card) =>
    bt.tokens.delete(card.id).catch((error) => {
      if (error instanceof BasisTheoryApiError && error.status === 404) {
        // id doesn't exist
        return;
      }

      throw error;
    })
  );

  await Promise.all(promises);
};

export { randomHex, readStripeCards, cleanupMigrationTokens };
