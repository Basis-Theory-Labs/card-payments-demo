import type { NextApiHandler } from 'next';
import { ApiError } from '@/server/ApiError';
import { replaceSession } from '@/server/session';

const setupApi: NextApiHandler = (req, res) => {
  if (req.method !== 'POST') {
    throw new ApiError(404);
  }

  if (
    !req.body?.publicApiKey ||
    !req.body?.privateApiKey ||
    !req.body?.stripePublishableKey ||
    !req.body?.stripeSecretKey
  ) {
    throw new ApiError(400);
  }

  replaceSession(req, res);

  res.status(200).end();
};

export default setupApi;
