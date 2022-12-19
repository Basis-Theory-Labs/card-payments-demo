import React, { PropsWithChildren, ReactNode } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  styled,
  ThemeProvider,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { SnackbarProvider } from 'notistack';
import { Logo } from '@/components/icons/logo';
import { yourApplication } from './theme';

const Circle = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.grey['300'],
  height: 10,
  width: 10,
  borderRadius: 10,
  marginRight: 6,
}));

interface Props {
  title?: string | false;
  subtitle?: string | false;
  icon?: ReactNode | false;
}

const ApplicationHeading = ({
  title = 'Mighty Insurance',
  subtitle = 'Checkout',
  icon = (
    <Logo
      sx={{
        mr: 1.5,
        height: 26,
      }}
    />
  ),
}: Props) => (
  <>
    {title && (
      <Box alignItems="center" display="flex">
        {icon}
        <Typography variant="h5">{title}</Typography>
      </Box>
    )}
    {subtitle && (
      <Typography color="text.secondary" variant="subtitle2">
        {subtitle}
      </Typography>
    )}
    <Divider
      sx={{
        my: 2,
      }}
    />
  </>
);

export const ApplicationPanel = ({
  children,
  ...headingProps
}: PropsWithChildren<Props>) => (
  <ThemeProvider theme={yourApplication}>
    <SnackbarProvider>
      <Card>
        <Box
          sx={{
            backgroundColor: 'grey.200',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 1.5,
          }}
        >
          <Box display="flex">
            <Circle />
            <Circle />
            <Circle />
          </Box>
          <Typography color="text.secondary" variant="subtitle2">
            {'Your Application'}
          </Typography>
          <Image
            alt="Company Logo"
            height="16"
            src="https://assets.website-files.com/605106363eeeec578e10aac6/60b65c8850078a3919b8580d_favi32.png"
            style={{ opacity: '0.5' }}
            width="16"
          />
        </Box>
        <CardContent>
          <Container maxWidth="sm">
            <ApplicationHeading {...headingProps} />
            {children}
          </Container>
        </CardContent>
      </Card>
    </SnackbarProvider>
  </ThemeProvider>
);
