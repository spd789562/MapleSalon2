import { useTranslate } from '@/context/i18n';

import UploadIcon from 'lucide-solid/icons/upload';
import { Button } from '@/components/ui/button';

import { uploadSceneImage } from '@/store/scene';

import { toaster } from '@/components/GlobalToast';

const DATA_URL_PREFIX_REG = /^data:image\/(png|jpg|jpeg|webp);base64,/;

export const UploadBackgroundButton = () => {
  const t = useTranslate();
  const handleUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target.files) {
      return;
    }

    const file = target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        return;
      }
      if (!DATA_URL_PREFIX_REG.test(result)) {
        toaster.error({
          title: t('setting.uploadFailed'),
          description: t('setting.fileFormatError'),
        });
        return;
      }
      uploadSceneImage(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Button as="label" title="上傳背景" size="sm" width="full">
      <input
        id="uploadBackground"
        type="file"
        accept=".png,.jpg,.jpeg, .webp"
        style={{ display: 'none' }}
        onChange={handleUpload}
      />
      {t('scene.uploadBackground')}
      <UploadIcon />
    </Button>
  );
};
