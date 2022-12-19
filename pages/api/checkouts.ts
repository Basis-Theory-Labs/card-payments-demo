import { ApiError } from '@/server/ApiError';
import { findCheckouts, insertCheckout } from '@/server/db';
import { apiWithSession } from '@/server/session';
import { Checkout, Session } from '@/types';

// /**
//  * Verifies if the payment token is already
//  * present in the database
//  */
// const isDuplicated = (tenant: string, paymentToken?: string): boolean =>
//   Boolean(
//     paymentToken &&
//       findCheckouts(tenant, {
//         paymentToken: {
//           $eq: paymentToken,
//         },
//       }).length
//   );

const createCheckout = (
  session: Session,
  {
    name,
    paymentToken,
    autoPolicyValue,
    autoPolicyType,
    homePolicyValue,
    homePolicyType,
    renterPolicyType,
    renterPolicyValue,
    tokenized,
  }: Omit<Checkout, 'tenant'>
) =>
  // if (tokenized && isDuplicated(session.id, paymentToken)) {
  //   throw new ApiError(409, `Duplicate Card. Fingerprint: ${paymentFingerprint}`);
  // }

  insertCheckout(session.id, {
    name,
    paymentToken,
    autoPolicyValue,
    autoPolicyType,
    homePolicyValue,
    homePolicyType,
    renterPolicyType,
    renterPolicyValue,
    tokenized,
  });

const checkoutsApi = apiWithSession(async (req, res, session) => {
  if (req.method === 'GET') {
    res.status(200).json(findCheckouts(session.id));

    return;
  }

  if (req.method !== 'POST') {
    throw new ApiError(404);
  }

  const {
    name,
    paymentToken,
    autoPolicyValue,
    autoPolicyType,
    homePolicyValue,
    homePolicyType,
    renterPolicyType,
    renterPolicyValue,
    tokenized,
  } = req.body;

  const checkout = await createCheckout(session, {
    name,
    paymentToken,
    autoPolicyValue,
    autoPolicyType,
    homePolicyValue,
    homePolicyType,
    renterPolicyType,
    renterPolicyValue,
    tokenized,
  });

  res.status(201).json(checkout);

  return;
});

export default checkoutsApi;
export { createCheckout };
