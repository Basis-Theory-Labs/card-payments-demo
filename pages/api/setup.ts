import type { NextApiHandler } from 'next';
import { ApiError } from '@/server/ApiError';
import { replaceSession } from '@/server/session';
import { cleanupMigrationTokens } from '@/server/utils';

const setupApi: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    throw new ApiError(404);
  }

  if (
    !req.body?.publicApiKey ||
    !req.body?.privateApiKey ||
    !req.body?.stripePublishableKey
  ) {
    throw new ApiError(400);
  }

  replaceSession(req, res);

  await cleanupMigrationTokens(req.body.privateApiKey);

  res.status(200).end();
};

export default setupApi;
