import { useEffect, useState } from 'react';
import Chance from 'chance';
import { Cart } from '@/types';

const chance = new Chance();

/**
 * Generates a ISO 8601 String
 * of a date 1 hour from now.
 */
const ttl = (): string =>
  new Date(
    Date.now() +
      1000 * // millis
        60 * // seconds
        60 * // minutes
        6 // hours
  ).toISOString();

const generateCardId = (format: AliasType) => {
  if (format === 'none') {
    return undefined;
  }

  if (format === 'custom') {
    return `card_${chance.string({
      length: 24,
      alpha: true,
      numeric: true,
    })}`;
  }

  if (format === 'bin') {
    return `{{ data.number | alias_card: 'true' }}`;
  }

  if (format === 'last4') {
    return `{{ data.number | alias_card: 'false', 'true' }}`;
  }

  if (format === 'both') {
    return `{{ data.number | alias_card: 'true', 'true' }}`;
  }

  return format;
};

const policies = ['Premium', 'Standard', 'Basic'];

const generatePolicy = () => ({
  type: chance.pickone(policies),
  value: chance.integer({
    min: 100,
    max: 2000,
  }),
});

const useCart = (): {
  cart: Cart;
  refresh: () => void;
} => {
  const [name, setName] = useState('');
  const [homePolicy, setHomePolicy] = useState({
    type: '',
    value: 0,
  });
  const [autoPolicy, setAutoPolicy] = useState({
    type: '',
    value: 0,
  });

  const refresh = () => {
    setName(chance.name());
    setHomePolicy(generatePolicy());
    setAutoPolicy(generatePolicy());
  };

  useEffect(() => {
    refresh();
  }, []);

  return {
    cart: {
      name,
      homePolicyType: homePolicy.type,
      homePolicyValue: homePolicy.value,
      autoPolicyType: autoPolicy.type,
      autoPolicyValue: autoPolicy.value,
    },
    refresh,
  };
};

export type AliasType = 'none' | 'custom' | 'last4' | 'bin' | 'both';

export { ttl, useCart, generateCardId };
