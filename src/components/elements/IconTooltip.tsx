import { Match, Switch } from 'solid-js';
import InfoIcon from 'lucide-solid/icons/info';
import CircleHelpIcon from 'lucide-solid/icons/circle-help';
import { SimpleTooltip } from '@/components/ui/tooltip';
import { CssTooltip } from '@/components/ui/cssTooltip';

export enum IconType {
  Info = 'info',
  Question = 'question',
}
export interface IconTooltopProps {
  tooltip: string;
  type: IconType;
  zIndex?: number;
  size?: number;
}
export const IconTooltop = (props: IconTooltopProps) => {
  return (
    <SimpleTooltip zIndex={props.zIndex} tooltip={props.tooltip}>
      <Switch>
        <Match when={props.type === IconType.Info}>
          <InfoIcon color="currentColor" size={props.size ?? '16'} />
        </Match>
        <Match when={props.type === IconType.Question}>
          <CircleHelpIcon color="currentColor" size={props.size ?? '16'} />
        </Match>
      </Switch>
    </SimpleTooltip>
  );
};

export interface IconCssTooltopProps extends IconTooltopProps {
  placement?: 'left' | 'right' | 'center';
}
export const IconCssTooltip = (props: IconCssTooltopProps) => {
  return (
    <CssTooltip
      placement={props.placement ?? 'center'}
      zIndex={props.zIndex}
      data-tooltip-content={props.tooltip}
    >
      <Switch>
        <Match when={props.type === IconType.Info}>
          <InfoIcon color="currentColor" size={props.size ?? '16'} />
        </Match>
        <Match when={props.type === IconType.Question}>
          <CircleHelpIcon color="currentColor" size={props.size ?? '16'} />
        </Match>
      </Switch>
    </CssTooltip>
  );
};
