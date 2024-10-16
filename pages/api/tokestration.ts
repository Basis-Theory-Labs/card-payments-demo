import { PaymentService } from '@basis-theory/tokestration-node-sdk-poc';
import {
  UniversalToken,
  Vendor,
} from '@basis-theory/tokestration-node-sdk-poc/interfaces/UniversalToken';
import { updatePaymentToken } from '@/server/db';
import { apiWithSession } from '@/server/session';
import { Checkout } from '@/types';

const vendorAuth = {
  stripe: '',
  braintree: {
    merchantId: '',
    publicKey: '',
    privateKey: '',
  },
};

const tokenize = async (
  paymentService: PaymentService,
  psp: Vendor,
  universalToken: UniversalToken
) => {
  universalToken = await paymentService.tokenize[psp]({
    universalToken,
  });
  return universalToken;
};

const charge = async (
  paymentService: PaymentService,
  psp: Vendor,
  universalToken: UniversalToken,
  checkout: Checkout
) => {
  return paymentService.charge[psp]?.({
    amount: checkout.autoPolicyValue! + checkout.homePolicyValue!,
    universalToken,
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

  const paymentService = new PaymentService({
    basisTheoryApiKey: session.privateApiKey,
    vendorAuth,
  });

  if (operation === 'tokenize') {
    universalToken = await tokenize(paymentService, psp, universalToken);
    persistToken(checkout, universalToken);
  } else if (operation === 'authorize') {
    console.error('not implemented');
  } else if (operation === 'charge') {
    const res = await charge(paymentService, psp, universalToken, checkout);
    console.log(JSON.stringify(res, null, 2));
  }

  res.status(201).json(universalToken);
});

export default tokestrationApi;
