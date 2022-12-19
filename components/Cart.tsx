import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Cart as CartModel } from '@/types';

export const Cart = ({
  name,
  homePolicyType,
  homePolicyValue = 0,
  autoPolicyType,
  autoPolicyValue = 0,
}: CartModel) => (
  <>
    <Typography sx={{ mt: 2 }} variant="h5">
      {name}
    </Typography>
    <Typography color="grey.400" sx={{ mb: 2 }} variant="subtitle2">
      {'Here is your price'}
    </Typography>
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead sx={{ th: { color: 'grey.500' } }}>
          <TableRow>
            <TableCell>{'Name'}</TableCell>
            <TableCell>{'Type'}</TableCell>
            <TableCell>{'Total'}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow sx={{ td: { color: 'grey.500' } }}>
            <TableCell>{'Home Policy'}</TableCell>
            <TableCell>{homePolicyType}</TableCell>
            <TableCell>
              {' $ '}
              {homePolicyValue}
            </TableCell>
          </TableRow>
          <TableRow sx={{ td: { color: 'grey.500' } }}>
            <TableCell>{'Auto Policy'}</TableCell>
            <TableCell>{autoPolicyType}</TableCell>
            <TableCell>
              {' $ '}
              {autoPolicyValue}
            </TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>
              <Typography color="grey.500" textAlign="right" variant="body2">
                {'Total'}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="grey.800" fontWeight="bold" variant="body2">
                {' $ '}
                {homePolicyValue + autoPolicyValue}
              </Typography>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  </>
);
