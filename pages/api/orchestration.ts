import axios from 'axios';
import { ApiError } from '@/server/ApiError';
import { apiWithSession } from '@/server/session';

const PAYMENTS_BASE_URL = 'https://dev.basistheory.solutions/orchestration';

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
        connection_id: psp,
      },
    });

    res.status(201).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

export default paymentProcessorApi;
