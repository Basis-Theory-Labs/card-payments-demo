import React, { useEffect, useState } from 'react';
import {
  UniversalToken,
  Vendor,
} from '@basis-theory/tokestration-node-sdk-poc/interfaces/UniversalToken';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  CardContent,
  Divider,
  FormControl,
  MenuItem,
  Select,
} from '@mui/material';
import axios from 'axios';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { CollapsableCard } from '@/components/CollapsableCard';
import { prismTheme } from '@/components/prismTheme';
import { Checkout } from '@/types';

interface Props {
  checkout?: Checkout;
}

export const TokestrationPanel = ({ checkout }: Props) => {
  const [busy, setBusy] = useState(false);
  const [psp, setPsp] = useState<Vendor>('braintree');
  const [universalToken, setUniversalToken] = useState<UniversalToken>();

  const checkoutTotal =
    (checkout?.autoPolicyValue || 0) + (checkout?.homePolicyValue || 0);

  const canCharge = universalToken?.vendors?.[psp]?.token;

  const submit = async (operation: string) => {
    setBusy(true);

    try {
      const { data } = await axios.post<UniversalToken>('/api/tokestration', {
        operation,
        checkout,
        universalToken,
        psp,
      });
      setUniversalToken(data);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (checkout) {
      try {
        setUniversalToken(JSON.parse(atob(checkout.paymentToken)));
      } catch {
        setUniversalToken({
          source: {
            cardToken: checkout.paymentToken,
          },
        });
      }
    }
  }, [checkout]);

  return (
    <CollapsableCard
      collapsed={!checkout}
      // onCollapse={onCollapse}
      title="Universal Token"
    >
      <CardContent>
        {Boolean(checkout) && (
          <>
            <SyntaxHighlighter
              customStyle={{ minHeight: '100%' }}
              language="json"
              showLineNumbers
              style={prismTheme}
            >
              {JSON.stringify(universalToken, undefined, 2)}
            </SyntaxHighlighter>
            <Divider sx={{ my: 4 }} />
            <Box alignItems="center" display="flex" whiteSpace="pre">
              {'Processor: '}
              <FormControl>
                <Select
                  label="Processor"
                  onChange={(e) => setPsp(e.target.value as Vendor)}
                  value={psp}
                  variant="standard"
                >
                  <MenuItem value="braintree">{'Braintree'}</MenuItem>
                  <MenuItem value="stripe">{'Stripe'}</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <LoadingButton
              color="primary"
              loading={busy}
              onClick={() => submit('tokenize')}
              sx={{ mt: 2 }}
              variant="contained"
            >
              {'Tokenize'}
            </LoadingButton>
            <LoadingButton
              color="primary"
              loading={busy}
              disabled
              onClick={() => submit('authorize')}
              sx={{ mt: 2, ml: 2 }}
              variant="contained"
            >
              {'Authorize ($0)'}
            </LoadingButton>
            <LoadingButton
              color="primary"
              loading={busy}
              disabled={!canCharge}
              onClick={() => submit('charge')}
              sx={{ mt: 2, ml: 2 }}
              variant="contained"
            >
              {`Charge $${checkoutTotal}`}
            </LoadingButton>
          </>
        )}
      </CardContent>
    </CollapsableCard>
  );
};
