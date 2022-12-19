import React, { FormEvent, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { Paper } from '@mui/material';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { Cart } from '@/components/Cart';
import { useCart } from './utils';

export const OriginalForm = () => {
  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { cart, refresh } = useCart();

  const elements = useElements();
  const stripe = useStripe();

  const canSubmit = cardComplete;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const cardElement = elements?.getElement(CardElement);

    if (!cardElement || !stripe || !canSubmit) {
      return;
    }

    setLoading(true);

    try {
      const { token, error } = await stripe.createToken(cardElement);

      if (error) {
        throw error;
      }

      await axios.post('/api/checkouts', {
        ...cart,
        paymentToken: token?.id,
      });
    } catch (error: any) {
      const message = error.message || error.response?.data?.message;

      if (message) {
        enqueueSnackbar(message, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          variant: 'error',
        });
      } else {
        throw error;
      }
    } finally {
      setLoading(false);
      cardElement.clear();
      refresh();
    }
  };

  return (
    <form onSubmit={submit}>
      <Cart {...cart} />
      <Paper
        sx={{
          mt: 2,
          py: 1.5,
          px: 1,
        }}
        variant="outlined"
      >
        <CardElement
          id="card-element"
          onChange={(e) => {
            setCardComplete(e.complete);
          }}
        />
      </Paper>

      <LoadingButton
        color="primary"
        disabled={!canSubmit}
        loading={loading}
        sx={{ mt: 2 }}
        type="submit"
        variant="contained"
      >
        {'Submit'}
      </LoadingButton>
    </form>
  );
};
