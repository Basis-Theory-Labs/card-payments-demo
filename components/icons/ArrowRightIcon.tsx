import React from 'react';
import type { SvgIconProps } from '@mui/material';
import { SvgIcon } from '@mui/material';

export const ArrowRight = (props: SvgIconProps): JSX.Element => (
  <SvgIcon viewBox="0 0 18 18" {...props}>
    <path
      clipRule="evenodd"
      d="M10.1023 4.85225C10.3219 4.63258 10.6781 4.63258 10.8977 4.85225L14.6477 8.60225C14.8674 8.82192 14.8674 9.17808 14.6477 9.39775L10.8977 13.1477C10.6781 13.3674 10.3219 13.3674 10.1023 13.1477C9.88258 12.9281 9.88258 12.5719 10.1023 12.3523L12.892 9.5625H3.75C3.43934 9.5625 3.1875 9.31066 3.1875 9C3.1875 8.68934 3.43934 8.4375 3.75 8.4375H12.892L10.1023 5.64775C9.88258 5.42808 9.88258 5.07192 10.1023 4.85225Z"
      fillRule="evenodd"
    />
  </SvgIcon>
);

export default ArrowRight;
