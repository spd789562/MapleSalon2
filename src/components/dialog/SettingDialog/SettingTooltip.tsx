import { IconTooltop, IconType } from '@/components/elements/IconTooltip';

export interface SettingTooltipProps {
  tooltip: string;
}
export const SettingTooltip = (props: SettingTooltipProps) => {
  return (
    <IconTooltop type={IconType.Info} zIndex={2300} tooltip={props.tooltip} />
  );
};
