import { useSkillTab } from './SkillTabContext';

import { BaseExportProgress } from '@/components/tab/Base/ExportProgress';

export const ExportProgress = () => {
  const [state] = useSkillTab();

  return (
    <BaseExportProgress
      isExporting={state.isExporting}
      exportProgress={state.exportProgress}
    />
  );
};
