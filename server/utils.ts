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

export { randomHex, readStripeCards };
