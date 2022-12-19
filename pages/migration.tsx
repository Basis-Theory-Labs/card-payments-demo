import React from 'react';
import { Grid } from '@mui/material';
import { ApplicationPanel } from '@/components/ApplicationPanel';
import { DatabaseTable } from '@/components/DatabaseTable';
import { MigrationForm } from '@/components/MigrationForm';
import { getServerSidePropsWithSession } from '@/server/session';

const Migration = () => (
  <Grid container direction="column" justifyContent="center" spacing={2}>
    <Grid item>
      <ApplicationPanel subtitle={false}>
        <MigrationForm />
      </ApplicationPanel>
    </Grid>
    <Grid item>
      <DatabaseTable />
    </Grid>
  </Grid>
);

export const getServerSideProps = getServerSidePropsWithSession();
export default Migration;
