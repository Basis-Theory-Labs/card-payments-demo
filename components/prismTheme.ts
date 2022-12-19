import type { Theme } from '@mui/material/styles';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { blissDark } from './theme';

const createPrismTheme = (theme: Theme) =>
  merge(cloneDeep(dracula), {
    'code[class*="language-"]': {
      fontFamily:
        "Source Code Pro, Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
      fontWeight: 500,
    },
    'pre[class*="language-"]': {
      background: theme.palette.background.default,
      fontFamily:
        "Source Code Pro, Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
      fontWeight: 500,
      fontSize: '12px',
      padding: theme.spacing(1),
    },
    function: {
      color: theme.palette.primary.main,
    },
  });

const prismTheme = createPrismTheme(blissDark);

export { prismTheme };
