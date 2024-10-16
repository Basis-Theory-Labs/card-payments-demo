import React, { useState } from 'react';
import type { Token } from '@basis-theory/basis-theory-js/types/models';
import { UniversalToken } from '@basis-theory/tokestration-node-sdk-poc/dist/interfaces/UniversalToken';
import { Grid } from '@mui/material';
import axios from 'axios';
import { DatabaseTable } from '@/components/DatabaseTable';
import { Response } from '@/components/Response';
import { TokestrationPanel } from '@/components/TokestrationPanel';
import { getServerSidePropsWithSession } from '@/server/session';
import type { Checkout, EchoResponse } from '@/types';

const Tokestration = () => {
  const [proxyResponse, setProxyResponse] = useState<EchoResponse>();
  const [responseCollapsed, setResponseCollapsed] = useState<boolean>(true);
  const [checkout, setCheckout] = useState<Checkout>();

  return (
    <Grid container direction="column" justifyContent="center" spacing={2}>
      <Grid item>
        <DatabaseTable onPaymentSelect={setCheckout} />
      </Grid>
      <Grid item>
        <TokestrationPanel checkout={checkout} />
      </Grid>
      <Grid item>
        <Response
          collapsed={responseCollapsed}
          data={proxyResponse}
          onCollapse={setResponseCollapsed}
        />
      </Grid>
    </Grid>
  );
};

export const getServerSideProps = getServerSidePropsWithSession((_, session) =>
  Promise.resolve({
    props: {
      publicApiKey: session.publicApiKey || null,
    },
  })
);

export default Tokestration;
