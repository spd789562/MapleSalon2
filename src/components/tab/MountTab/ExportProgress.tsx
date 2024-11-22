import { useMountTab } from './MountTabContext';

import { BaseExportProgress } from '@/components/tab/Base/ExportProgress';

export const ExportProgress = () => {
  const [state] = useMountTab();

  return (
    <BaseExportProgress
      isExporting={state.isExporting}
      exportProgress={state.exportProgress}
    />
  );
};
