import { styled } from 'styled-system/jsx/factory';

import LoaderCircle from 'lucide-solid/icons/loader-circle';

export interface SpingLoadingProps {
  size?: number | string;
}
export const SpinLoading = (props: SpingLoadingProps) => {
  return (
    <Loading>
      <LoaderCircle size={props.size} />
    </Loading>
  );
};

const Loading = styled('div', {
  base: {
    animation: 'rotate infinite 1s linear',
    color: 'fg.muted',
  },
});
