import { createContext, useContext, type JSX } from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import type { Skill } from '@/renderer/skill/skill';
import type { Character } from '@/renderer/character/character';

export interface SkillTabContextState {
  isLoading: boolean;
  isExporting: boolean;
  skillRef?: Skill;
  characterRef?: Character;
  exportProgress: number;
  exportTotal: number;
}
export interface SkillTabContextHandler {
  setSkillRef: (ref?: Skill) => void;
  setCharacterRef: (ref: Character) => void;
  setIsLoading: (isLoading: boolean) => void;
  startExport: () => void;
  updateExportProgress: (progress: number, total: number) => void;
  finishExport: () => void;
}

export const SkillTabContext =
  createContext<[SkillTabContextState, SkillTabContextHandler]>();

export function SkillTabProvider(props: {
  children: JSX.Element;
}) {
  let _skillRef: Skill | undefined;
  let _characterRef: Character | undefined;
  const [state, setState] = createStore({
    isLoading: false,
    isExporting: false,
    exportProgress: 0,
    exportTotal: 0,
    get skillRef() {
      return _skillRef;
    },
    get characterRef() {
      return _characterRef;
    },
  });

  function setSkillRef(ref?: Skill) {
    _skillRef = ref;
  }
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
    <SkillTabContext.Provider
      value={[
        state,
        {
          setSkillRef,
          setCharacterRef,
          setIsLoading,
          startExport,
          updateExportProgress,
          finishExport,
        },
      ]}
    >
      {props.children}
    </SkillTabContext.Provider>
  );
}

export function useSkillTab() {
  const context = useContext(SkillTabContext);

  if (!context) {
    throw new Error('useSkillTab must be used within a SkillTabProvider');
  }

  return context;
}
