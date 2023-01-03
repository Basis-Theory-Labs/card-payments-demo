import React, { useState } from 'react';
import type { Token } from '@basis-theory/basis-theory-js/types/models';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  CardContent,
  Divider,
  FormControl,
  MenuItem,
  Select,
} from '@mui/material';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { CollapsableCard } from '@/components/CollapsableCard';
import { prismTheme } from '@/components/prismTheme';

interface Props {
  paymentToken?: Token;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => unknown;
  onSubmit?: (psp: string) => unknown;
}

export const ProxyPanel = ({
  paymentToken,
  collapsed,
  onCollapse,
  onSubmit,
}: Props) => {
  const [busy, setBusy] = useState(false);
  const [psp, setPsp] = useState('adyen');

  const handleSubmit = async () => {
    setBusy(true);

    try {
      await onSubmit?.(psp);
    } finally {
      setBusy(false);
    }
  };

  return (
    <CollapsableCard
      collapsed={collapsed}
      onCollapse={onCollapse}
      title="Basis Theory Token"
    >
      <CardContent>
        {Boolean(paymentToken) && (
          <>
            <SyntaxHighlighter
              customStyle={{ minHeight: '100%' }}
              language="json"
              showLineNumbers
              style={prismTheme}
            >
              {JSON.stringify(paymentToken, undefined, 2)}
            </SyntaxHighlighter>
            <Divider sx={{ my: 4 }} />
            <Box alignItems="center" display="flex" whiteSpace="pre">
              {'Send token data to '}
              <FormControl>
                <Select
                  label="Processor"
                  onChange={(e) => setPsp(e.target.value)}
                  value={psp}
                  variant="standard"
                >
                  <MenuItem value="adyen">{'Adyen'}</MenuItem>
                  <MenuItem value="jpmc">{'JPMC'}</MenuItem>
                  <MenuItem value="tabapay">{'TabaPay'}</MenuItem>
                  <MenuItem value="stripe">{'Stripe'}</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <LoadingButton
              color="primary"
              loading={busy}
              onClick={handleSubmit}
              sx={{ mt: 2 }}
              variant="contained"
            >
              {'Submit'}
            </LoadingButton>
          </>
        )}
      </CardContent>
    </CollapsableCard>
  );
};
