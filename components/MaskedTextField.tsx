import React, { RefCallback } from 'react';
import { IMaskInput } from 'react-imask';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  mask: string;
}

const MaskedTextField = React.forwardRef<HTMLInputElement, CustomProps>(
  // eslint-disable-next-line get-off-my-lawn/prefer-arrow-functions
  function MaskedTextField({ onChange, mask, name, ...other }, ref) {
    return (
      <IMaskInput
        {...other}
        definitions={{
          '#': /[1-9]/u,
        }}
        inputRef={ref as RefCallback<HTMLInputElement>}
        mask={mask}
        onAccept={(value) =>
          onChange?.({
            target: {
              name,
              value: value as string,
            },
          })
        }
        overwrite
      />
    );
  }
);

export { MaskedTextField };
