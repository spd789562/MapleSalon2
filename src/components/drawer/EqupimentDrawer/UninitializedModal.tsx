import { styled } from 'styled-system/jsx/factory';

import { VStack } from 'styled-system/jsx/vstack';
import { SpinLoading } from '@/components/elements/SpinLoading';

export const UninitializedModal = () => {
  return (
    <Modal gap={2}>
      <SpinLoading size={48} />
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
