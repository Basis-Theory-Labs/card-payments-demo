import React from 'react';
import {
  BasisTheoryProvider,
  useBasisTheory,
} from '@basis-theory/basis-theory-react';
import { Container, CssBaseline, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Navigation } from '@/components/Navigation';
import { blissDark } from '@/components/theme';

const MyApp = ({
  Component,
  pageProps: { publicApiKey, ...pageProps },
}: AppProps) => {
  const { bt } = useBasisTheory(publicApiKey, {
    elements: true,
  });

  return (
    <>
      <Head>
        <title>{'Card Payments'}</title>
      </Head>
      <ThemeProvider theme={blissDark}>
        <CssBaseline />

        <Navigation />
        <Container sx={{ mt: 3 }}>
          <BasisTheoryProvider bt={bt}>
            <Component {...pageProps} />
          </BasisTheoryProvider>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default MyApp;
