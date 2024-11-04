import { styled } from 'styled-system/jsx/factory';

import { VStack } from 'styled-system/jsx/vstack';
import { ChairDataLoadButton } from './ChairDataLoadButton';

export const ChairUninitializedModal = () => {
  return (
    <Modal gap={2}>
      <ChairDataLoadButton />
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
    background: 'rgba(0, 0, 0, 0.1)',
  },
});
