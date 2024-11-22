import { createSignal, createMemo, Show } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';
import { useStore } from '@nanostores/solid';

import { setItemContextMenuTargetInfo } from '@/store/itemContextMenu';
import { $showItemGender } from '@/store/settingDialog';

import CircleHelpIcon from 'lucide-solid/icons/circle-help';
import { Skeleton } from '@/components/ui/skeleton';
import { Flex } from 'styled-system/jsx/flex';

import { useItemContextTrigger } from '@/context/itemContextMenu';

import { getIconPath, getSkillIconPath, getGender } from '@/utils/itemId';
import { Gender } from '@/utils/itemId';

import DyeableLabelIcon from '@/assets/color_label.png';

export interface LoadableEquipIconProps {
  id: number;
  isDyeable?: boolean;
  name?: string;
  width?: string;
  height?: string;
  folder?: string;
  isSkill?: boolean;
}
export const LoadableEquipIcon = (props: LoadableEquipIconProps) => {
  const [isLoaded, setIsLoaded] = createSignal(false);
  const [isError, setIsError] = createSignal(false);
  const showItemGender = useStore($showItemGender);

  function onLoad(_: Event) {
    setIsLoaded(true);
  }

  function onError(_: Event) {
    setIsLoaded(true);
    setIsError(true);
  }

  const iconPath = createMemo(() =>
    props.isSkill
      ? getSkillIconPath(props.id, props.folder)
      : getIconPath(props.id, props.folder),
  );
  const gender = createMemo(() =>
    showItemGender() ? getGender(props.id) : Gender.Share,
  );

  const contextTriggerProps = useItemContextTrigger();

  function handleContextMenu(event: MouseEvent) {
    setItemContextMenuTargetInfo({
      id: props.id,
      name: props.name || props.id.toString(),
      icon: iconPath(),
    });
    const cb = contextTriggerProps.onContextMenu as unknown as (
      event: MouseEvent,
    ) => void;
    cb?.(event);
  }

  return (
    <Skeleton
      height="full"
      display="flex"
      justifyContent="center"
      alignItems="center"
      isLoaded={isLoaded()}
    >
      <IconContainer
        gender={gender()}
        width={props.width}
        height={props.height}
      >
        <Show when={!isError()} fallback={<CircleHelpIcon />}>
          <img
            {...contextTriggerProps}
            onContextMenu={handleContextMenu}
            src={iconPath()}
            alt={props.name || props.id.toString()}
            onLoad={onLoad}
            onError={onError}
            style={{ 'max-height': '100%' }}
          />
        </Show>
        <Show when={props.isDyeable}>
          <DyeableLabel src={DyeableLabelIcon} alt="Dyeable" />
        </Show>
      </IconContainer>
    </Skeleton>
  );
};

const IconContainer = styled(Flex, {
  base: {
    p: '1',
    width: '9',
    height: '9',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'fg.muted',
    borderRadius: 'md',
  },
  variants: {
    gender: {
      0: {
        backgroundColor: 'iris.a4',
      },
      1: {
        backgroundColor: 'tomato.a4',
      },
      2: {
        backgroundColor: 'transparent',
      },
    },
  },
});

const DyeableLabel = styled('img', {
  base: {
    position: 'absolute',
    bottom: '1',
    right: '1',
  },
});
