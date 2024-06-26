import { Portal } from 'solid-js/web';

import { Button, type ButtonProps } from './button';

export interface SideOpenButtonProps extends ButtonProps {
  direction?: 'left' | 'right';
  top?: ButtonProps['top'];
}
export const SideOpenButton = (props: SideOpenButtonProps) => {
  const directionProps =
    props.direction === 'left'
      ? { left: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }
      : { right: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0 };

  return (
    <Portal>
      <Button
        position="fixed"
        size="sm"
        top={props.top || 4}
        boxShadow="1px 2px 4px rgba(0, 0, 0, 0.3)"
        {...directionProps}
        {...props}
      />
    </Portal>
  );
};
