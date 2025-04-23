import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import {
  $tagVersion,
  setTagVersion as setSettingTagVersion,
} from '@/store/settingDialog';
import { setTagVersion } from '@/store/character/action';

import { SimpleSelect, type ValueChangeDetails } from '@/components/ui/select';

import { TagVersion, TagVersionList } from '@/const/setting/tagVersion';

export const TagVersionSelect = () => {
  const t = useTranslate();
  const tagVersion = useStore($tagVersion);

  async function handleChange(details: ValueChangeDetails) {
    const value = details.value[0] as TagVersion;
    if (value) {
      setTagVersion(value);
      setSettingTagVersion(value);
    }
  }

  return (
    <SimpleSelect
      id="tag-version-select"
      value={[tagVersion().toString()]}
      items={TagVersionList.map((version) => ({
        value: version,
        label: version.toUpperCase(),
      }))}
      onValueChange={handleChange}
      positioning={{ sameWidth: true }}
    />
  );
};
