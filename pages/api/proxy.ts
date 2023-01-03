import axios from 'axios';
import { ApiError } from '@/server/ApiError';
import { apiWithSession } from '@/server/session';
import { randomHex } from '@/server/utils';

const PAYMENT_PROCESSOR_KEY = randomHex();
const PAYMENT_PROCESSOR_API_ENDPOINT = 'https://echo.basistheory.com/anything';

const jpmcPayload = (cardToken: string) => ({
  paymentInstrument: {
    customerAccountType: 'CC',
    card: {
      ccAccountNum: `{{ ${cardToken} | json: '$.number' }}`,
      ccExp: `{{ ${cardToken} | json: '$.expiration_year' }}{{ ${cardToken} | json: '$.expiration_month' | pad_left: 2, '0' }}`, // yyyyMM
    },
  },
});

const adyenPayload = (cardToken: string) => ({
  paymentMethod: {
    type: 'scheme',
    number: `{{ ${cardToken} | json: '$.number' }}`,
    expiryMonth: `{{ ${cardToken} | json: '$.expiration_month' | pad_left: 2, '0' }}`,
    expiryYear: `{{ ${cardToken} | json: '$.expiration_year' | to_string }}`,
  },
});

const tabapayPayload = (cardToken: string) => ({
  card: {
    accountNumber: `{{ ${cardToken} | json: '$.number' }}`,
    expirationDate: `{{ ${cardToken} | json: '$.expiration_year' }}{{ ${cardToken} | json: '$.expiration_month' | pad_left: 2, '0' }}`, // yyyyMM
  },
});

const stripePayload = (cardToken: string) => ({
  type: 'card',
  card: {
    number: `{{ ${cardToken} | json: '$.number' }}`,
    exp_month: `{{ ${cardToken} | json: '$.expiration_month' | to_number }}`,
    exp_year: `{{ ${cardToken} | json: '$.expiration_year' | to_number }}`,
  },
});

const paymentProcessorApi = apiWithSession(async (req, res, session) => {
  const { cardToken, psp } = req.body;

  if (
    req.method !== 'POST' ||
    typeof cardToken !== 'string' ||
    typeof psp !== 'string'
  ) {
    throw new ApiError(404);
  }

  let payload = {};

  if (psp === 'jpmc') {
    payload = jpmcPayload(cardToken);
  } else if (psp === 'adyen') {
    payload = adyenPayload(cardToken);
  } else if (psp === 'tabapay') {
    payload = tabapayPayload(cardToken);
  } else if (psp === 'stripe') {
    payload = stripePayload(cardToken);
  }

  const { data } = await axios.request({
    url: 'https://api.basistheory.com/proxy',
    method: 'POST',
    headers: {
      'BT-API-KEY': session.privateApiKey,
      'BT-PROXY-URL': PAYMENT_PROCESSOR_API_ENDPOINT,
      'PSP-AUTH-KEY': PAYMENT_PROCESSOR_KEY,
      // 'BT-TRACE-ID': randomHex(),
    },
    data: payload,
  });

  res.status(201).json(data);
});

export default paymentProcessorApi;
