import { BasisTheory } from '@basis-theory/basis-theory-js';
import { ApiError } from '@/server/ApiError';
import { apiWithSession } from '@/server/session';

const searchApi = apiWithSession(async (req, res, session) => {
  const { id } = req.query;

  if (req.method !== 'GET' || typeof id !== 'string') {
    throw new ApiError(404);
  }

  // initializes SDK with the API key
  const bt = await new BasisTheory().init(session.privateApiKey);

  const token = await bt.tokens.retrieve(id);

  res.status(200).json(token);
});

export default searchApi;
