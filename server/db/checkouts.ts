import _merge from 'lodash/merge';
import type { Checkout } from '@/types';
import { loki } from './loki';

const checkouts = () => loki.getCollection<Checkout>('checkouts');

const seedCheckouts = (tenant: string) => {
  checkouts().insert({
    name: 'Charlie Conway',
    autoPolicyValue: 4250,
    autoPolicyType: 'Premium',
    homePolicyValue: 3000,
    homePolicyType: 'Standard',
    paymentToken: 'card_4hhyft9srlbmq3sn5qr5vrjs',
    tenant,
  } as Checkout);

  checkouts().insert({
    name: 'Adam Banks',
    autoPolicyValue: 4130,
    autoPolicyType: 'Premium',
    homePolicyValue: 5250,
    homePolicyType: 'Premium',
    paymentToken: 'card_n5ejt1hlsrupz5qicqlo8d4f',
    tenant,
  } as Checkout);

  checkouts().insert({
    name: 'Greg Goldberg',
    autoPolicyValue: 2350,
    autoPolicyType: 'Basic',
    homePolicyValue: 2350,
    homePolicyType: 'Basic',
    paymentToken: 'tok_wrarflzrjsnb79nm1wtc627i',
    tenant,
  } as Checkout);
};

const insertCheckout = (tenant: string, doc: Omit<Checkout, 'tenant'>) =>
  checkouts().insert({
    ...doc,
    tenant,
  }) as Checkout;

const findCheckouts = (tenant: string, query: LokiQuery<Checkout> = {}) =>
  checkouts().find(
    _merge(query, {
      tenant: {
        $eq: tenant,
      },
    })
  );

const updateCheckouts = (docs: Checkout | Checkout[]) =>
  checkouts().update(docs);

const removeCheckouts = (tenant: string) => {
  checkouts().removeWhere({
    tenant: {
      $eq: tenant,
    },
  });
};

export {
  insertCheckout,
  findCheckouts,
  updateCheckouts,
  removeCheckouts,
  seedCheckouts,
};
