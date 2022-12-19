import React from 'react';
import { ExpandMore } from '@mui/icons-material';
import { Card, CardHeader, Collapse } from '@mui/material';
import type { CardProps } from '@mui/material';

interface Props extends Omit<CardProps, 'title'> {
  title?: React.ReactNode;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => unknown;
}

export const CollapsableCard = ({
  title,
  collapsed,
  onCollapse,
  children,
  ...props
}: Props) => (
  <Card {...props}>
    <CardHeader
      action={
        <ExpandMore
          sx={(theme) => ({
            transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
              duration: theme.transitions.duration.shortest,
            }),
          })}
        />
      }
      onClick={() => onCollapse?.(!collapsed)}
      sx={{
        cursor: 'pointer',
      }}
      title={title}
    />
    <Collapse in={!collapsed}>{children}</Collapse>
  </Card>
);
