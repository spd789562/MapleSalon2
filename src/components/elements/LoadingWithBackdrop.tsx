import type { JSX } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';

import LoaderCircle from 'lucide-solid/icons/loader-circle';

interface LoadingWithBackdropProps {
  size?: number;
  children?: JSX.Element;
}
export const LoadingWithBackdrop = (props: LoadingWithBackdropProps) => {
  return (
    <LoadingBackdrop>
      {props.children}
      <Loading>
        <LoaderCircle size={props.size ?? 48} />
      </Loading>
    </LoadingBackdrop>
  );
};

const LoadingBackdrop = styled('div', {
  base: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'bg.muted',
    opacity: 0.75,
  },
});

const Loading = styled('div', {
  base: {
    animation: 'rotate infinite 1s linear',
    color: 'fg.muted',
  },
});
