import React from 'react';
import { Grid } from '@mui/material';
import type { GetServerSideProps, NextPage } from 'next';
import { ApplicationPanel } from '@/components/ApplicationPanel';
import { SetupForm } from '@/components/SetupForm';
import { getSession } from '@/server/session';

interface Props {
  hasSession?: boolean;
}

const Home: NextPage<Props> = ({ hasSession }) => (
  <Grid container direction="column" justifyContent="center" spacing={2}>
    <Grid item>
      <ApplicationPanel
        icon={false}
        subtitle="Enter your Application Keys"
        title="Setup (test)"
      >
        <SetupForm hasSession={hasSession} />
      </ApplicationPanel>
    </Grid>
  </Grid>
);

export const getServerSideProps: GetServerSideProps = (context) => {
  const { valid } = getSession(context.req);

  return Promise.resolve({
    props: {
      hasSession: valid,
    },
  });
};

export default Home;
