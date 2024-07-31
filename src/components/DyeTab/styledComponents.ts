import { styled } from 'styled-system/jsx/factory';

export const CardContainer = styled('div', {
  base: {
    p: 2,
    borderRadius: 'md',
    boxShadow: 'md',
    backgroundColor: 'bg.default',
    maxWidth: '100%',
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
