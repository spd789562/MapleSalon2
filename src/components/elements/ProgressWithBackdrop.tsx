import { splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { styled } from 'styled-system/jsx/factory';

import {
  LineProgress,
  CircleProgress,
  type RootProps,
} from '@/components/ui/progress';

export interface ProgressWithBackdropProps extends RootProps {
  type: 'line' | 'circle';
}
export const ProgressWithBackdrop = (props: ProgressWithBackdropProps) => {
  const [localProps, rootProps] = splitProps(props, ['type']);
  return (
    <LoadingPositioner>
      <ProgressContent>
        <Dynamic
          component={
            localProps.type === 'circle' ? CircleProgress : LineProgress
          }
          {...rootProps}
        />
      </ProgressContent>
      <LoadingBackdrop />
    </LoadingPositioner>
  );
};

const LoadingPositioner = styled('div', {
  base: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    px: '20%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const LoadingBackdrop = styled('div', {
  base: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'bg.muted',
    opacity: 0.75,
  },
});

const ProgressContent = styled('div', {
  base: {
    position: 'relative',
    width: '100%',
    zIndex: 1,
  },
});
