import { createContext, useContext, type JSX } from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import type { Character } from '@/renderer/character/character';

export interface CharacterPreviewContextState {
  isLoading: boolean;
  isExporting: boolean;
  characterRef?: Character;
  exportProgress: number;
  exportTotal: number;
}
export interface CharacterPreviewContextHandler {
  setCharacterRef: (ref: Character) => void;
  setIsLoading: (isLoading: boolean) => void;
  startExport: () => void;
  updateExportProgress: (progress: number, total: number) => void;
  finishExport: () => void;
}

export const CharacterPreviewContext =
  createContext<
    [CharacterPreviewContextState, CharacterPreviewContextHandler]
  >();

export function CharacterPreviewProvider(props: {
  children: JSX.Element;
}) {
  let _characterRef: Character | undefined;
  const [state, setState] = createStore({
    isLoading: false,
    isExporting: false,
    exportProgress: 0,
    exportTotal: 0,
    get characterRef() {
      return _characterRef;
    },
  });

  function setCharacterRef(ref: Character) {
    _characterRef = ref;
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
    <CharacterPreviewContext.Provider
      value={[
        state,
        {
          setCharacterRef,
          setIsLoading,
          startExport,
          updateExportProgress,
          finishExport,
        },
      ]}
    >
      {props.children}
    </CharacterPreviewContext.Provider>
  );
}

export function useCharacterPreview() {
  const context = useContext(CharacterPreviewContext);

  if (!context) {
    throw new Error(
      'useCharacterPreview must be used within a CharacterPreviewProvider',
    );
  }

  return context;
}
