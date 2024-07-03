import type { JSX } from 'solid-js';

import { css } from 'styled-system/css';

export interface AppContainerProps {
  children: JSX.Element;
}
export const AppContainer = (props: AppContainerProps) => {
  return (
    <div
      class={css({
        position: 'relative',
        mx: { base: 0, lg: 2 },
        paddingLeft: { base: 2, lg: '{sizes.xs}' },
        paddingRight: { base: 2, lg: '{sizes.sm}' },
      })}
    >
      {props.children}
    </div>
  );
};
