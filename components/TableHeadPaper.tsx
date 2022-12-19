import React from 'react';
import { Paper } from '@mui/material';

export const TableHeadPaper = ({ ...props }) => (
  <Paper
    component="thead"
    elevation={2}
    sx={{
      border: 'none',
      th: {
        color: 'text.secondary',
      },
    }}
    {...props}
  />
);
