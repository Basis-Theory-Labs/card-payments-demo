import axios from 'axios';
import { ApiError } from '@/server/ApiError';
import { apiWithSession } from '@/server/session';

const PAYMENTS_BASE_URL = 'https://dev.basistheory.solutions/orchestration';

const PROCESSOR_MAP: { [key: string]: string } = {
  adyen: '9387e2bd-3023-4749-b82d-7f942e0a95b8',
  stripe: 'cef20687-da38-4504-af53-f722db7e3cc1',
};

const paymentProcessorApi = apiWithSession(async (req, res, session) => {
  const { cardToken, psp, amount } = req.body;

  if (
    req.method !== 'POST' ||
    typeof cardToken !== 'string' ||
    typeof psp !== 'string' ||
    typeof amount !== 'number'
  ) {
    throw new ApiError(404);
  }

  const specificPSP =
    psp !== 'auto'
      ? {
          connection_id: PROCESSOR_MAP[psp],
        }
      : {};

  try {
    const { data } = await axios.request({
      baseURL: PAYMENTS_BASE_URL,
      url: 'transactions',
      method: 'POST',
      headers: {
        'BT-API-KEY': session.privateApiKey,
      },
      data: {
        amount: amount * 100, // cents
        currency: 'USD',
        token: cardToken,
        ...specificPSP,
      },
    });

    res.status(201).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

export default paymentProcessorApi;
