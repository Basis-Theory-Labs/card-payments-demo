import React from 'react';
import {
  AppBar,
  Box,
  Button,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon';
import ArrowRightIcon from '@/components/icons/ArrowRightIcon';

interface Route {
  route: string;
  title: string;
}

const routes: Route[] = [
  {
    route: '/',
    title: 'Setup',
  },
  {
    route: '/home',
    title: 'Home',
  },
  {
    route: '/elements',
    title: 'Elements',
  },
  {
    route: '/migration',
    title: 'Migration',
  },
  {
    route: '/proxy',
    title: 'Proxy',
  },
];

interface CurrentRoutes {
  previous?: Route;
  current?: Route;
  next?: Route;
}

const useRoutes = (): CurrentRoutes => {
  const router = useRouter();

  const index = routes.findIndex((i) => i.route === router.route);

  return {
    previous: routes[index - 1],
    current: routes[index],
    next: routes[index + 1],
  };
};

const Navigation = () => {
  const { previous, current, next } = useRoutes();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = (route: string) => {
    router.push(route);
    handleClose();
  };

  return (
    <AppBar component="nav" elevation={1} position="static">
      <Toolbar>
        <NextLink href={previous?.route ?? '/'} passHref>
          <Button
            startIcon={<ArrowLeftIcon />}
            sx={{ visibility: previous ? 'inherit' : 'hidden' }}
          >
            {'Previous'}
          </Button>
        </NextLink>
        <Box flexGrow={1} textAlign="center">
          <Button color="info" onClick={handleClick} variant="text">
            <Typography
              align="center"
              color="text.secondary"
              sx={{ flexGrow: 1 }}
              variant="subtitle2"
            >
              {current?.title}
            </Typography>
          </Button>
          <Menu
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            anchorEl={anchorEl}
            id="basic-menu"
            onClose={handleClose}
            open={open}
          >
            {routes.map((route) => (
              <MenuItem key={route.route} onClick={() => navigate(route.route)}>
                {route.title}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        <NextLink href={next?.route ?? '/'} passHref>
          <Button
            endIcon={<ArrowRightIcon />}
            sx={{ visibility: next ? 'inherit' : 'hidden' }}
          >
            {'Next'}
          </Button>
        </NextLink>
      </Toolbar>
    </AppBar>
  );
};

export { Navigation };
