import InfoIcon from 'lucide-solid/icons/info';
import { SimpleTooltip } from '@/components/ui/tooltip';

export interface SettingTooltipProps {
  tooltip: string;
}
export const SettingTooltip = (props: SettingTooltipProps) => {
  return (
    <SimpleTooltip zIndex={2300} tooltip={props.tooltip}>
      <InfoIcon color="currentColor" size="16" />
    </SimpleTooltip>
  );
};
