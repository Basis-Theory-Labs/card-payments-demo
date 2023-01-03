import React, { useState } from 'react';
import type { Token } from '@basis-theory/basis-theory-js/types/models';
import { Grid } from '@mui/material';
import axios from 'axios';
import { DatabaseTable } from '@/components/DatabaseTable';
import { ProxyPanel } from '@/components/ProxyPanel';
import { Response } from '@/components/Response';
import { getServerSidePropsWithSession } from '@/server/session';
import type { EchoResponse } from '@/types';

const Proxy = () => {
  const [proxyResponse, setProxyResponse] = useState<EchoResponse>();
  const [responseCollapsed, setResponseCollapsed] = useState<boolean>(true);
  const [tokenCollapsed, setTokenCollapsed] = useState<boolean>(true);
  const [paymentToken, setPaymentToken] = useState<Token>();

  const handlePaymentSelect = async (tokenId: string) => {
    const response = await axios.get<Token>(`/api/tokens/${tokenId}`);

    setPaymentToken(response.data);
    setTokenCollapsed(false);
  };

  const handleProxySubmit = async (psp: string) => {
    const { data } = await axios.post<EchoResponse>('/api/proxy', {
      cardToken: paymentToken?.id,
      psp,
    });

    setProxyResponse(data);
    setTokenCollapsed(true);
    setResponseCollapsed(false);
  };

  return (
    <Grid container direction="column" justifyContent="center" spacing={2}>
      <Grid item>
        <DatabaseTable onPaymentSelect={handlePaymentSelect} />
      </Grid>
      <Grid item>
        <ProxyPanel
          collapsed={tokenCollapsed}
          onCollapse={setTokenCollapsed}
          onSubmit={handleProxySubmit}
          paymentToken={paymentToken}
        />
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

export default Proxy;
