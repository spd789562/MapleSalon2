import { createMemo, onMount, Show } from 'solid-js';
import { useStore } from '@nanostores/solid';
import type { ReadableAtom } from 'nanostores';

import {
  $currentTour,
  $mainTourOpen,
  closeMainTour,
  openMainTour,
} from '@/store/tour';
import { $mainTourWatched, setMainTourWatched } from '@/store/settingDialog';

import { useLocale, useTranslate } from '@/context/i18n';

import {
  useTour,
  SimpleTour,
  type TourStepDetails,
} from '@/components/ui/tour';

export interface GlobalTourProps {
  onClose?: () => void;
}
export const GlobalTour = (props: GlobalTourProps) => {
  const locale = useLocale();
  const t = useTranslate();

  const translatedSteps = createMemo(() => {
    const _ = locale();
    const steps = $currentTour.get();

    return steps.map((step) => {
      return {
        ...step,
        title: t(step.title),
        description: t(step.description),
        actions: step.actions?.map((action) => {
          return {
            ...action,
            label: t(action.label),
          };
        }),
      } as TourStepDetails;
    });
  });

  const tour = useTour({
    steps: translatedSteps(),
    closeOnInteractOutside: false,
    preventInteraction: true,
    translations: {
      progressText: (details) => {
        return t('tour.progress', {
          current: details.current + 1,
          total: details.total,
        });
      },
    },
    onStatusChange(details) {
      if (details.status === 'completed' || details.status === 'dismissed') {
        closeMainTour();
        props.onClose?.();
      }
    },
  });

  onMount(() => {
    tour().start();
  });

  return <SimpleTour tour={tour} />;
};

function useGlobalTour(options: {
  showAtom: ReadableAtom<boolean>;
  watchedAtom: ReadableAtom<boolean>;
  defaultShow: boolean;
  openTour: () => void;
  onClose?: () => void;
}) {
  const isShow = useStore(options.showAtom);

  function onClose() {
    options.onClose?.();
  }

  onMount(() => {
    if (options.defaultShow && !options.watchedAtom.get()) {
      options.openTour();
    }
  });

  return {
    isShow,
    onClose,
  };
}

export const MainTour = () => {
  const { isShow, onClose } = useGlobalTour({
    showAtom: $mainTourOpen,
    watchedAtom: $mainTourWatched,
    defaultShow: true,
    openTour: openMainTour,
    onClose: () => {
      setMainTourWatched(true);
    },
  });

  return (
    <Show when={isShow()}>
      <GlobalTour onClose={onClose} />
    </Show>
  );
};
