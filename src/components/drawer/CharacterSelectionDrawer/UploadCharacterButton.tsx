import { useTranslate } from '@/context/i18n';

import UploadIcon from 'lucide-solid/icons/upload';
import { Button } from '@/components/ui/button';

import {
  type SaveCharacterData,
  appendCharacter,
  verifySaveCharacterData,
  createCharacterUniqueId,
} from '@/store/characterDrawer';
import { getEquipById } from '@/store/string';

import { toaster } from '@/components/GlobalToast';

import { getHeadIdFromBodyId, isBodyId } from '@/utils/itemId';

export const UploadCharacterButton = () => {
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

      try {
        const data = (JSON.parse(result) || {}) as SaveCharacterData;
        if (!verifySaveCharacterData(data)) {
          throw new Error('invalid character data');
        }
        data.id = createCharacterUniqueId();
        for (const itemKey in data.items) {
          const item = data.items[itemKey as keyof typeof data.items];
          if (item?.id && !item?.name) {
            let equip = getEquipById(item.id);
            if (isBodyId(item.id)) {
              equip = getEquipById(getHeadIdFromBodyId(item.id));
            }
            if (equip) {
              item.name = equip.name;
            }
          }
        }

        appendCharacter(data);
      } catch (error) {
        console.error(error);
        toaster.error({
          title: t('setting.uploadFailed'),
          description: t('setting.fileFormatError'),
        });
      } finally {
        target.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <Button as="label" title={t('setting.uploadCharacter')} size="xs">
      <input
        id="uploadCharacter"
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleUpload}
      />
      {t('setting.upload')}
      <UploadIcon />
    </Button>
  );
};
