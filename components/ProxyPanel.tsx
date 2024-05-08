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
import type { Connection } from '@/types';

interface Props {
  paymentToken?: Token;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => unknown;
  onSubmit?: (psp: string) => unknown;
  connections?: Connection[];
}

const defaultConnections: Connection[] = [
  { id: 'stripe', name: 'Stripe' },
  { id: 'adyen', name: 'Adyen' },
  { id: 'jpmc', name: 'JPMC' },
  { id: 'tabapay', name: 'TabaPay' },
];

export const ProxyPanel = ({
  paymentToken,
  collapsed,
  onCollapse,
  onSubmit,
  connections = defaultConnections,
}: Props) => {
  const [busy, setBusy] = useState(false);
  const [psp, setPsp] = useState(connections[0].id);

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
                  {connections.map((connection) => (
                    <MenuItem key={connection.id} value={connection.id}>
                      {connection.name}
                    </MenuItem>
                  ))}
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
