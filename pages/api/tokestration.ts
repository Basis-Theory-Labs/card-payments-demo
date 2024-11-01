import { PaymentService } from '@basis-theory/tokestration-node-sdk-poc';
import {
  UniversalToken,
  Provider,
} from '@basis-theory/tokestration-node-sdk-poc/interfaces/UniversalToken';
import { updatePaymentToken } from '@/server/db';
import { apiWithSession } from '@/server/session';
import { Checkout } from '@/types';

const vendorAuth = {
  providerAuth: {
    basisTheory: {
      privateKey: process.env.BASIS_THEORY_API_KEY!,
    },
    stripe: process.env.STRIPE_SECRET_KEY!,
    adyen: {
      apiKey: process.env.ADYEN_API_KEY!,
      merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT!,
    },
    braintree: {
      merchantId: process.env.BRAINTREE_MERCHANT_ID!,
      publicKey: process.env.BRAINTREE_PUBLIC_KEY!,
      privateKey: process.env.BRAINTREE_PRIVATE_KEY!,
    },
    tabapay: {
      clientId: process.env.TABAPAY_CLIENT_ID!,
      accessToken: process.env.TABAPAY_ACCESS_TOKEN!,
    },
    chaseOrbital: {
      username: process.env.CHASE_ORBITAL_USERNAME!,
      password: process.env.CHASE_ORBITAL_PASSWORD!,
      merchantId: process.env.CHASE_ORBITAL_MERCHANT_ID!,
    },
    checkout: {
      privateKey: process.env.CHECKOUT_PRIVATE_KEY!,
      publicKey: process.env.CHECKOUT_PUBLIC_KEY!,
    },
  },
};
const paymentService = new PaymentService(vendorAuth);

const tokenize = async (
  paymentService: PaymentService,
  psp: Provider,
  universalToken: UniversalToken
) => {
  console.log('tokenize', universalToken);
  ({ universalToken } = await paymentService.tokenize[psp]({
    token: universalToken,
  }));
  return universalToken;
};

const charge = async (
  paymentService: PaymentService,
  psp: Provider,
  universalToken: UniversalToken,
  checkout: Checkout
) => {
  return paymentService.charge[psp]?.({
    amount: checkout.autoPolicyValue! + checkout.homePolicyValue!,
    token: universalToken,
  });
};

const persistToken = (checkout: Checkout, universalToken: UniversalToken) => {
  const encoded = Buffer.from(JSON.stringify(universalToken)).toString(
    'base64'
  );
  updatePaymentToken(checkout.id!, encoded);
};

const tokestrationApi = apiWithSession(async (req, res, session) => {
  let { operation, checkout, universalToken, psp } = req.body;

  if (operation === 'tokenize') {
    universalToken = await tokenize(paymentService, psp, universalToken);
    persistToken(checkout, universalToken);
    res.status(201).json(universalToken);
  } else if (operation === 'authorize') {
    console.error('not implemented');
  } else if (operation === 'charge') {
    const chargeResponse = await charge(
      paymentService,
      psp,
      universalToken,
      checkout
    );
    console.log(JSON.stringify(chargeResponse, null, 2));
    res.status(200).json(chargeResponse);
  }
});

export default tokestrationApi;
