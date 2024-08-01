import { styled } from 'styled-system/jsx/factory';

export const CardContainer = styled('div', {
  base: {
    p: 2,
    borderRadius: 'md',
    boxShadow: 'md',
    backgroundColor: 'bg.default',
    maxWidth: '100%',
    minWidth: '75%',
  },
});

export const TableContainer = styled('div', {
  base: {
    overflowX: 'auto',
    maxWidth: '100%',
  },
});

export const ColorBlock = styled('div', {
  base: {
    borderRadius: 'md',
    boxShadow: 'md',
    w: 6,
    h: 6,
    display: 'inline-block',
  },
});

export const EmptyBlock = styled('div', {
  base: {
    py: 12,
    border: '3px dashed',
    borderColor: 'bg.emphasized',
    borderRadius: 'xl',
    textAlign: 'center',
    color: 'fg.subtle',
    fontSize: '2xl',
  },
});
