import { useChairTab } from './ChairTabContext';

import { BaseExportProgress } from '@/components/tab/Base/ExportProgress';

export const ExportProgress = () => {
  const [state] = useChairTab();

  return (
    <BaseExportProgress
      isExporting={state.isExporting}
      exportProgress={state.exportProgress}
    />
  );
};
