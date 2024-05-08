import axios from 'axios';
import { ApiError } from '@/server/ApiError';
import { apiWithSession } from '@/server/session';

const connectionsApi = apiWithSession(async (req, res) => {
  if (req.method !== 'GET') {
    throw new ApiError(404);
  }

  const {
    data: { items },
  } = await axios(
    'https://dev.basistheory.solutions/orchestration/connections'
  );

  res.status(200).json(
    items.map(({ id, name }) => ({
      id,
      name,
    }))
  );
});

export default connectionsApi;
