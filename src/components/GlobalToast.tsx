import { Show } from 'solid-js';

import CloseIcon from 'lucide-solid/icons/x';
import { IconButton } from '@/components/ui/icon-button';
import {
  Toaster,
  Root as Toast,
  Title,
  Description,
  CloseTrigger,
  createToaster,
} from '@/components/ui/toast';

export const toaster = createToaster({
  placement: 'bottom-end',
  overlap: false,
  gap: 16,
});

export const GlobalToast = () => {
  return (
    <Toaster toaster={toaster}>
      {(toast) => (
        <Toast variant={toast().type as unknown as 'info'}>
          <Title>{toast().title}</Title>
          <Show when={toast().description}>
            {(desc) => <Description>{desc()}</Description>}
          </Show>
          <CloseTrigger
            asChild={(props) => (
              <IconButton variant="link" size="sm" {...props()}>
                <CloseIcon />
              </IconButton>
            )}
          />
        </Toast>
      )}
    </Toaster>
  );
};
