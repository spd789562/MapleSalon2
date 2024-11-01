import { createContext, useContext, type JSX } from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import type { Chair } from '@/renderer/chair/chair';

export interface ChairTabContextState {
  isLoading: boolean;
  isExporting: boolean;
  chairRef?: Chair;
  exportProgress: number;
  exportTotal: number;
}
export interface ChairTabContextHandler {
  setChairRef: (ref: Chair) => void;
  setIsLoading: (isLoading: boolean) => void;
  startExport: () => void;
  updateExportProgress: (progress: number, total: number) => void;
  finishExport: () => void;
}

export const ChairTabContext =
  createContext<[ChairTabContextState, ChairTabContextHandler]>();

export function ChairTabProvider(props: {
  children: JSX.Element;
}) {
  let _chairRef: Chair | undefined;
  const [state, setState] = createStore({
    isLoading: false,
    isExporting: false,
    exportProgress: 0,
    exportTotal: 0,
    get chairRef() {
      return _chairRef;
    },
  });

  function setChairRef(ref: Chair) {
    _chairRef = ref;
  }
  function setIsLoading(isLoading: boolean) {
    setState('isLoading', isLoading);
  }
  function startExport() {
    setState('isExporting', true);
  }
  function updateExportProgress(progress: number, total: number) {
    setState('exportProgress', Math.floor((progress / total) * 100));
  }
  function finishExport() {
    setState(
      produce((data) => {
        data.isExporting = false;
        data.exportProgress = 0;
      }),
    );
  }

  return (
    <ChairTabContext.Provider
      value={[
        state,
        {
          setChairRef,
          setIsLoading,
          startExport,
          updateExportProgress,
          finishExport,
        },
      ]}
    >
      {props.children}
    </ChairTabContext.Provider>
  );
}

export function useChairTab() {
  const context = useContext(ChairTabContext);

  if (!context) {
    throw new Error('useChairTab must be used within a ChairTabProvider');
  }

  return context;
}
