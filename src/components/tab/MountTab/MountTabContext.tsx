import { createContext, useContext, type JSX } from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import type { TamingMob } from '@/renderer/tamingMob/tamingMob';

export interface MountTabContextState {
  isLoading: boolean;
  isExporting: boolean;
  mountRef?: TamingMob;
  exportProgress: number;
  exportTotal: number;
  mountActions: string[];
}
export interface MountTabContextHandler {
  setMountRef: (ref: TamingMob) => void;
  setIsLoading: (isLoading: boolean) => void;
  startExport: () => void;
  updateExportProgress: (progress: number, total: number) => void;
  finishExport: () => void;
  setMountActions: (actions: string[]) => void;
}

export const MountTabContext =
  createContext<[MountTabContextState, MountTabContextHandler]>();

export function MountTabProvider(props: {
  children: JSX.Element;
}) {
  let _mountRef: TamingMob | undefined;
  const [state, setState] = createStore({
    isLoading: false,
    isExporting: false,
    exportProgress: 0,
    exportTotal: 0,
    mountActions: [] as string[],
    get mountRef() {
      return _mountRef;
    },
  });

  function setMountRef(ref: TamingMob) {
    _mountRef = ref;
  }
  function setIsLoading(isLoading: boolean) {
    setState('isLoading', isLoading);
    if (!isLoading) {
      setMountActions(state.mountRef?.actions || []);
    }
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
  function setMountActions(actions: string[]) {
    setState('mountActions', actions);
  }

  return (
    <MountTabContext.Provider
      value={[
        state,
        {
          setMountRef,
          setIsLoading,
          startExport,
          updateExportProgress,
          finishExport,
          setMountActions,
        },
      ]}
    >
      {props.children}
    </MountTabContext.Provider>
  );
}

export function useMountTab() {
  const context = useContext(MountTabContext);

  if (!context) {
    throw new Error('useMountTab must be used within a MountTabProvider');
  }

  return context;
}
