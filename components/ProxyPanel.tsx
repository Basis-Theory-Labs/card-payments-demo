import React from 'react';
import type { Token } from '@basis-theory/basis-theory-js/types/models';
import { Button, CardContent } from '@mui/material';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { CollapsableCard } from '@/components/CollapsableCard';
import { prismTheme } from '@/components/prismTheme';

interface Props {
  paymentToken?: Token;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => unknown;
  onSubmit?: () => unknown;
}

export const ProxyPanel = ({
  paymentToken,
  collapsed,
  onCollapse,
  onSubmit,
}: Props) => (
  <CollapsableCard
    collapsed={collapsed}
    onCollapse={onCollapse}
    title="Basis Theory Token"
  >
    <CardContent>
      {Boolean(paymentToken) && (
        <SyntaxHighlighter
          customStyle={{ minHeight: '100%' }}
          language="json"
          showLineNumbers
          style={prismTheme}
        >
          {JSON.stringify(paymentToken, undefined, 2)}
        </SyntaxHighlighter>
      )}
      <Button
        color="primary"
        onClick={() => onSubmit?.()}
        sx={{ mt: 2 }}
        variant="contained"
      >
        {'Submit'}
      </Button>
    </CardContent>
  </CollapsableCard>
);
