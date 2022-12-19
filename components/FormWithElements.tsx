import React, { FormEvent, useRef, useState } from 'react';
import type { CardElement as ICardElement } from '@basis-theory/basis-theory-js/types/elements';
import { useBasisTheory, CardElement } from '@basis-theory/basis-theory-react';
import { LoadingButton } from '@mui/lab';
import { Paper } from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { Cart } from '@/components/Cart';
import { generateCardId, ttl, useCart } from './utils';

export const FormWithElements = () => {
  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { cart, refresh } = useCart();

  const { bt } = useBasisTheory();
  const cardElementRef = useRef<ICardElement>(null);

  const canSubmit = cardComplete;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const cardElement = cardElementRef?.current;

    if (!bt || !cardElement || !canSubmit) {
      return;
    }

    setLoading(true);

    try {
      const token = await bt.tokens.create({
        id: generateCardId(),
        type: 'card',
        data: cardElement,
        expiresAt: ttl(),
      });

      await axios.post('/api/checkouts', {
        ...cart,
        paymentToken: token.id,
        tokenized: true,
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
          py: 1,
          px: 1,
        }}
        variant="outlined"
      >
        <CardElement
          id="card-element"
          onChange={(e) => {
            setCardComplete(e.complete);
          }}
          ref={cardElementRef}
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
