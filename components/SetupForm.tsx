import React, { FormEvent, useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import type { StandardTextFieldProps } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Props extends Omit<StandardTextFieldProps, 'onChange'> {
  onChange: (value: string) => unknown;
}

const PasswordField = ({ value, onChange, label, ...props }: Props) => {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onMouseDown={() => setVisible(true)}
              onMouseUp={() => setVisible(false)}
            >
              {visible ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      fullWidth
      label={label}
      onChange={(e) => onChange(e.target.value)}
      required
      size="small"
      sx={{ mt: 2 }}
      type={visible ? 'text' : 'password'}
      value={value}
      {...props}
    />
  );
};

const SetupForm = ({ hasSession }: { hasSession?: boolean }) => {
  const [publicApiKey, setPublicApiKey] = useState('');
  const [privateApiKey, setPrivateApiKey] = useState('');
  const [stripePublishableKey, setStripePublishableKey] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const canSubmit =
    publicApiKey.length && privateApiKey.length && stripePublishableKey.length;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/setup', {
        publicApiKey,
        privateApiKey,
        stripePublishableKey,
      });
      await router.push('/home');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <Typography variant="h6">{'Basis Theory'}</Typography>
      <PasswordField
        helperText={
          <>
            {'Click '}
            <Link
              href="https://portal.basistheory.com/applications/create?name=Card+Payments+Frontend&type=public&permissions=token%3Acreate"
              target="_blank"
            >
              {'here'}
            </Link>
            {' to create an Application with the required permissions'}
          </>
        }
        label="Public API Key"
        name="publicApiKey"
        onChange={setPublicApiKey}
        value={publicApiKey}
      />
      <PasswordField
        helperText={
          <>
            {'Click '}
            <Link
              href="https://portal.basistheory.com/applications/create?name=Card+Payments+Backend&permissions=token%3Acreate&permissions=token%3Aread&permissions=token%3Ause"
              target="_blank"
            >
              {'here'}
            </Link>
            {' to create an Application with the required permissions'}
          </>
        }
        label="Private API Key"
        name="privateApiKey"
        onChange={setPrivateApiKey}
        value={privateApiKey}
      />
      <Divider
        sx={{
          mt: 2,
          mb: 1,
        }}
      />
      <Typography variant="h6">{'Stripe'}</Typography>
      <PasswordField
        label="Publishable Key"
        name="stripePublishableKey"
        onChange={setStripePublishableKey}
        value={stripePublishableKey}
      />
      <LoadingButton
        disabled={!canSubmit}
        loading={loading}
        sx={{ mt: 2 }}
        type="submit"
        variant="contained"
      >
        {'Get Started'}
      </LoadingButton>
      {hasSession && (
        <Alert
          action={
            <Button
              onClick={() => router.push('/home')}
              type="button"
              variant="text"
            >
              {'Skip'}
            </Button>
          }
          severity="warning"
          sx={{
            mt: 2,
          }}
        >
          {
            'By submitting this again, your previous session database will be reset.'
          }
        </Alert>
      )}
    </form>
  );
};

export { SetupForm };
