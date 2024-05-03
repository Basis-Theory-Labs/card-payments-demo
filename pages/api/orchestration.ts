import axios from 'axios';
import { ApiError } from '@/server/ApiError';
import { getBearerToken } from '@/server/payments';
import { apiWithSession } from '@/server/session';

const PAYMENTS_BASE_URL = 'https://payments.basistheory.solutions';

const PROCESSOR_MAP: { [key: string]: string } = {
  adyen: '9387e2bd-3023-4749-b82d-7f942e0a95b8',
  stripe: 'f4c57207-ebd9-4909-af79-350d3d45392a',
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

  const bearer = await getBearerToken();

  const specificPSP =
    psp !== 'auto'
      ? {
          payment_service_id: PROCESSOR_MAP[psp],
        }
      : {};

  try {
    const { data } = await axios.request({
      baseURL: PAYMENTS_BASE_URL,
      url: 'transactions',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${bearer}`,
      },
      data: {
        amount: amount * 100, // cents
        currency: 'USD',
        card: `{{ ${cardToken} }}`,
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
