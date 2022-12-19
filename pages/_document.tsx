import React from 'react';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import {
  INTER_FONT,
  OUTFIT_FONT,
  SOURCE_CODE_PRO_FONT,
} from '@/components/constants';

class MyDocument extends Document {
  public render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <link href={SOURCE_CODE_PRO_FONT} rel="stylesheet" />
          <link href={OUTFIT_FONT} rel="stylesheet" />
          <link href={INTER_FONT} rel="stylesheet" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
