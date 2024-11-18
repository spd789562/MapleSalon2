import { createContext, useContext, type JSX } from 'solid-js';
import { createStore, produce } from 'solid-js/store';

export interface ActionTabContextState {
  isExporting: boolean;
  exportProgress: number;
  exportTotal: number;
}
export interface ActionTabContextHandler {
  startExport: () => void;
  updateExportProgress: (progress: number, total: number) => void;
  finishExport: () => void;
}

export const ActionTabContext =
  createContext<[ActionTabContextState, ActionTabContextHandler]>();

export function ActionTabProvider(props: {
  children: JSX.Element;
}) {
  const [state, setState] = createStore({
    isExporting: false,
    exportProgress: 0,
    exportTotal: 0,
  });

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
    <ActionTabContext.Provider
      value={[
        state,
        {
          startExport,
          updateExportProgress,
          finishExport,
        },
      ]}
    >
      {props.children}
    </ActionTabContext.Provider>
  );
}

export function useActionTab() {
  const context = useContext(ActionTabContext);

  if (!context) {
    throw new Error('useActionTab must be used within a ActionTabProvider');
  }

  return context;
}
