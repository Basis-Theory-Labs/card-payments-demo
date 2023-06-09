import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  ThemeProvider,
} from '@mui/material';
import { ApplicationPanel } from '@/components/ApplicationPanel';
import { DatabaseTable } from '@/components/DatabaseTable';
import { FormWithElements } from '@/components/FormWithElements';
import { yourApplication } from '@/components/theme';
import type { AliasType } from '@/components/utils';
import { getServerSidePropsWithSession } from '@/server/session';

const Elements = () => {
  const [aliasType, setAliasType] = useState<AliasType>('none');

  return (
    <Grid container direction="column" justifyContent="center" spacing={2}>
      <Grid item>
        <ApplicationPanel subtitle={false}>
          <FormWithElements aliasType={aliasType} />
        </ApplicationPanel>
      </Grid>
      <Grid item>
        <Card>
          <CardContent>
            <FormControl>
              <FormLabel>{'Aliasing Format'}</FormLabel>
              <RadioGroup
                onChange={(event) =>
                  setAliasType(event.target.value as AliasType)
                }
                row
                value={aliasType}
              >
                <FormControlLabel
                  control={<Radio />}
                  label="None"
                  value="none"
                />
                <FormControlLabel
                  control={<Radio />}
                  label="Stripe (custom)"
                  value="custom"
                />
                <FormControlLabel
                  control={<Radio />}
                  label="Preserve BIN"
                  value="bin"
                />
                <FormControlLabel
                  control={<Radio />}
                  label="Preserve last 4"
                  value="last4"
                />
                <FormControlLabel
                  control={<Radio />}
                  label="Preserve Both"
                  value="both"
                />
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>
      </Grid>
      <Grid item>
        <DatabaseTable />
      </Grid>
    </Grid>
  );
};

export const getServerSideProps = getServerSidePropsWithSession((_, session) =>
  Promise.resolve({
    props: {
      publicApiKey: session.publicApiKey || null,
    },
  })
);

export default Elements;
