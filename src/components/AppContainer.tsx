import type { JSX } from 'solid-js';
import { css } from 'styled-system/css';
import { useStore } from '@nanostores/solid';

import {
  $currentEquipmentDrawerPin,
  $equpimentDrawerPin,
} from '@/store/trigger';

export interface AppContainerProps {
  children: JSX.Element;
}
export const AppContainer = (props: AppContainerProps) => {
  const isLeftDrawerPin = useStore($currentEquipmentDrawerPin);
  const isRightDrawerPin = useStore($equpimentDrawerPin);
  return (
    <div
      class={css({
        position: 'relative',
        mx: { base: 0, lg: 2 },
        mt: 4,
        paddingLeft: isLeftDrawerPin()
          ? { base: 2, lg: '{sizes.xs}' }
          : { base: 2, '2xl': '{sizes.xs}' },
        paddingRight: isRightDrawerPin()
          ? { base: 2, lg: '{sizes.sm}' }
          : { base: 2, '2xl': '{sizes.sm}' },
      })}
    >
      {props.children}
    </div>
  );
};
