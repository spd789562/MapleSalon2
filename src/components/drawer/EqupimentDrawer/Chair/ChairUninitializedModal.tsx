import { styled } from 'styled-system/jsx/factory';

import { VStack } from 'styled-system/jsx/vstack';
import { ChairDataLoadButton } from './ChairDataLoadButton';
import { DefaultLoadChairSwitch } from '@/components/dialog/SettingDialog/RenderSetting/DefaultLoadChairSwitch';

export const ChairUninitializedModal = () => {
  return (
    <Modal gap={2}>
      <ChairDataLoadButton />
      <DefaultLoadChairSwitch />
    </Modal>
  );
};

const Modal = styled(VStack, {
  base: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white.a10',
    backdropFilter: 'blur(4px)',
  },
});
