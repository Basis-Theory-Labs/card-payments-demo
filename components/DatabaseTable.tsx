import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import useSWR from 'swr';
import type { Checkout } from '@/types';
import { TableHeadPaper } from './TableHeadPaper';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Props {
  onPaymentSelect?: (paymentToken: string) => unknown;
}

export const DatabaseTable = ({ onPaymentSelect }: Props) => {
  const { data } = useSWR<Checkout[]>('/api/checkouts', fetcher, {
    refreshInterval: 100,
  });

  return (
    <Card>
      <CardHeader title="Database" />
      <CardContent>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead component={TableHeadPaper}>
              <TableRow>
                <TableCell>{'ID'}</TableCell>
                <TableCell>{'Name'}</TableCell>
                <TableCell>{'Home Policy'}</TableCell>
                <TableCell>{'Auto Policy'}</TableCell>
                <TableCell>{'Payment'}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map?.((checkout) => (
                <TableRow key={checkout.id}>
                  <TableCell>
                    <Typography variant="code">{checkout.id}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{checkout.name}</Typography>
                  </TableCell>
                  <TableCell>
                    {checkout.homePolicyType}
                    <br />
                    <Typography color="text.secondary">
                      {'$ '}
                      {checkout.homePolicyValue}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {checkout.autoPolicyType}
                    <br />
                    <Typography color="text.secondary">
                      {'$ '}
                      {checkout.autoPolicyValue}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {checkout.tokenized ? (
                      onPaymentSelect ? (
                        <Link
                          component="button"
                          onClick={() => onPaymentSelect(checkout.paymentToken)}
                          underline="hover"
                        >
                          <Typography variant="code">
                            {checkout.paymentToken}
                          </Typography>
                        </Link>
                      ) : (
                        <Typography color="warning.main" variant="code">
                          {checkout.paymentToken}
                        </Typography>
                      )
                    ) : (
                      <Typography
                        color="text.secondary"
                        sx={{ wordBreak: 'break-all' }}
                        variant="code"
                      >
                        {checkout.paymentToken}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};
