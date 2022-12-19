import axios from 'axios';
import { ApiError } from '@/server/ApiError';
import { apiWithSession } from '@/server/session';
import { randomHex } from '@/server/utils';

const PAYMENT_PROCESSOR_KEY = randomHex();
const PAYMENT_PROCESSOR_API_ENDPOINT = 'https://echo.basistheory.com/anything';

const paymentProcessorApi = apiWithSession(async (req, res, session) => {
  const { cardToken } = req.body;

  if (req.method !== 'POST' || typeof cardToken !== 'string') {
    throw new ApiError(404);
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
    data: {
      paymentInstrument: {
        customerAccountType: 'CC',
        card: {
          ccAccountNum: `{{ ${cardToken} | json: '$.number' }}`,
          ccExp: `{{ ${cardToken} | json: '$.expiration_year' }}{{ ${cardToken} | json: '$.expiration_month' | pad_left: 2, '0' }}`, // yyyyMM
        },
      },
    },
  });

  res.status(201).json(data);
});

export default paymentProcessorApi;
