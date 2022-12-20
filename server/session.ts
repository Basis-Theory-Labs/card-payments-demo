import type {
  GetServerSideProps,
  GetServerSidePropsResult,
  NextApiRequest,
} from 'next';
import { NextApiHandler } from 'next';
import { NextApiResponse } from 'next/dist/shared/lib/utils';
import { GetServerSidePropsContext } from 'next/types';
import { destroyCookie, setCookie } from 'nookies';
import { ApiError } from '@/server/ApiError';
import {
  findSession,
  insertSession,
  removeCheckouts,
  removeSession,
  seedCheckouts,
} from '@/server/db';
import { Session } from '@/types';
import { randomHex } from './utils';

const SESSION_COOKIE_NAME = 'MightyInsuranceSession';
const DEFAULT_SESSION = 'default';

// eslint-disable-next-line node/no-process-env
const isUseDefaultSession = () => process.env.USE_DEFAULT_SESSION === 'true';

const getSession = (req: {
  cookies: Partial<Record<string, string>>;
}):
  | { valid: false; session?: never }
  | { valid: false; session: string }
  | { valid: true; session: Session } => {
  const id = isUseDefaultSession()
    ? DEFAULT_SESSION
    : req.cookies[SESSION_COOKIE_NAME];

  if (id) {
    const session = findSession(id);

    if (session) {
      return {
        session,
        valid: true,
      };
    }

    return {
      session: id,
      valid: false,
    };
  }

  return {
    valid: false,
  };
};

const createSession = (res: NextApiResponse, keys: Omit<Session, 'id'>) => {
  const id = isUseDefaultSession() ? DEFAULT_SESSION : randomHex();

  insertSession({
    id,
    ...keys,
  });
  seedCheckouts(id);

  setCookie(
    {
      res,
    },
    SESSION_COOKIE_NAME,
    id,
    {
      maxAge: 60 * 60, // 1 hour session
      secure: true,
      path: '/',
      sameSite: 'none',
    }
  );

  return id;
};

type GetServerSidePropsWithSession<R = Record<string, any>> = (
  context: GetServerSidePropsContext,
  session: Omit<Session, 'privateApiKey'>
) => Promise<GetServerSidePropsResult<R>>;

const getServerSidePropsWithSession =
  (handler?: GetServerSidePropsWithSession): GetServerSideProps =>
  (context) => {
    const { session, valid } = getSession(context.req);

    if (!valid) {
      return Promise.resolve({
        redirect: {
          permanent: false,
          destination: '/',
        },
      });
    }

    if (typeof handler !== 'function') {
      return Promise.resolve({ props: {} });
    }

    return handler(context, session);
  };

type ApiHandlerWithSession = (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) => unknown | Promise<unknown>;

const destroySession = (session: string, res: NextApiResponse) => {
  destroyCookie(
    {
      res,
    },
    SESSION_COOKIE_NAME
  );
  removeSession(session);
  removeCheckouts(session);
};

const replaceSession = (req: NextApiRequest, res: NextApiResponse) => {
  const { session, valid } = getSession(req);

  if (valid) {
    removeSession(session.id);
    removeCheckouts(session.id);
  }

  return createSession(res, req.body);
};

const apiWithSession =
  (apiHandler: ApiHandlerWithSession): NextApiHandler =>
  async (req, res) => {
    const { session, valid } = getSession(req);

    if (!valid) {
      if (session) {
        destroySession(session, res);
      }

      res.status(401).end();

      return;
    }

    try {
      await apiHandler(req, res, session);
    } catch (error) {
      if (error instanceof ApiError && res.writable) {
        res.status(error.statusCode).json({
          message: error.message,
        });

        return;
      }

      // eslint-disable-next-line no-console
      console.error(error);

      res.status(500).end();
    }
  };

export {
  getSession,
  replaceSession,
  apiWithSession,
  getServerSidePropsWithSession,
};
