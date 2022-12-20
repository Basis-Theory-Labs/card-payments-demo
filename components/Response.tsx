import React, { useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Card,
  CardContent,
  Chip,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { CollapsableCard } from '@/components/CollapsableCard';
import { prismTheme } from '@/components/prismTheme';
import type { EchoResponse } from '@/types';

interface Props {
  data?: EchoResponse;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => unknown;
}

const specialHeaders = new Set(['BT-TRACE-ID', 'PSP-AUTH-KEY']);

const Response = ({ data, collapsed, onCollapse }: Props) => {
  const [tab, setTab] = useState('payload');

  return (
    <CollapsableCard
      collapsed={collapsed}
      onCollapse={onCollapse}
      sx={{ mb: 2 }}
      title="Response"
    >
      {data && (
        <CardContent>
          <Card
            sx={{
              p: 2,
              mb: 2,
            }}
          >
            {data.method && (
              <Chip
                label={data.method}
                sx={(theme) => ({
                  borderRadius: theme.shape.borderRadius,
                  background: 'rgba(0, 210, 239, 0.15)',
                  border: '1px solid rgba(0, 210, 239, 0.15)',
                  color: '#00B3CC',
                  fontWeight: 600,
                })}
              />
            )}
            {data.url && (
              <Typography
                component="span"
                fontSize={14}
                sx={{ ml: 2 }}
                variant="code"
              >
                {data.url}
              </Typography>
            )}
          </Card>
          <TabContext value={tab}>
            <TabList onChange={(_, value) => setTab(value)} sx={{ mb: 2 }}>
              <Tab label="Headers" value="headers" />
              <Tab label="Payload" value="payload" />
            </TabList>
            <TabPanel value="headers">
              {data.headers && (
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableBody>
                      {Object.entries(data.headers).map(([header, value]) => {
                        const isSpecial = specialHeaders.has(
                          header.toUpperCase()
                        );

                        return (
                          <TableRow hover key={header}>
                            <TableCell>
                              <Typography
                                color={
                                  isSpecial ? 'warning.main' : 'text.primary'
                                }
                                fontWeight={500}
                                lineHeight="1"
                                variant="overline"
                              >
                                {header}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                color={
                                  isSpecial ? 'warning.main' : 'text.secondary'
                                }
                                sx={{
                                  wordBreak: 'break-all',
                                }}
                                variant="code"
                              >
                                {value as string}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </TabPanel>
            <TabPanel value="payload">
              {Boolean(data.json) && (
                <SyntaxHighlighter
                  customStyle={{ minHeight: '100%' }}
                  language="json"
                  showLineNumbers
                  style={prismTheme}
                >
                  {JSON.stringify(data.json, undefined, 2)}
                </SyntaxHighlighter>
              )}
            </TabPanel>
          </TabContext>
        </CardContent>
      )}
    </CollapsableCard>
  );
};

export { Response };
