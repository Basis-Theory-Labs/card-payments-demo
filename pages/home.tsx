import React, { useMemo } from 'react';
import { Grid } from '@mui/material';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import type { NextPage } from 'next';
import { ApplicationPanel } from '@/components/ApplicationPanel';
import { DatabaseTable } from '@/components/DatabaseTable';
import { OriginalForm } from '@/components/OriginalForm';
import { INTER_FONT } from '@/components/constants';
import { getServerSidePropsWithSession } from '@/server/session';
import { Session } from '@/types';

const Home: NextPage<Pick<Session, 'stripePublishableKey'>> = ({
  stripePublishableKey,
}) => {
  const stripePromise = useMemo(
    () => loadStripe(stripePublishableKey),
    [stripePublishableKey]
  );

  return (
    <Elements
      options={{
        fonts: [
          {
            cssSrc: INTER_FONT,
          },
        ],
      }}
      stripe={stripePromise}
    >
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item>
          <ApplicationPanel subtitle={false}>
            <OriginalForm />
          </ApplicationPanel>
        </Grid>
        <Grid item>
          <DatabaseTable />
        </Grid>
      </Grid>
    </Elements>
  );
};

export const getServerSideProps = getServerSidePropsWithSession(
  (_, { stripePublishableKey }) =>
    Promise.resolve({
      props: {
        stripePublishableKey,
      },
    })
);

export default Home;
