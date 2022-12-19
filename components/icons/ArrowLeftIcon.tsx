import React from 'react';
import type { SvgIconProps } from '@mui/material';
import { SvgIcon } from '@mui/material';

export const ArrowLeft = (props: SvgIconProps): JSX.Element => (
  <SvgIcon viewBox="0 0 18 18" {...props}>
    <path
      clipRule="evenodd"
      d="M7.89775 13.1477C7.67808 13.3674 7.32192 13.3674 7.10225 13.1477L3.35225 9.39775C3.13258 9.17808 3.13258 8.82192 3.35225 8.60225L7.10225 4.85225C7.32192 4.63258 7.67808 4.63258 7.89775 4.85225C8.11742 5.07192 8.11742 5.42808 7.89775 5.64775L5.10799 8.4375H14.25C14.5607 8.4375 14.8125 8.68934 14.8125 9C14.8125 9.31066 14.5607 9.5625 14.25 9.5625L5.10799 9.5625L7.89775 12.3523C8.11742 12.5719 8.11742 12.9281 7.89775 13.1477Z"
      fillRule="evenodd"
    />
  </SvgIcon>
);

export default ArrowLeft;
