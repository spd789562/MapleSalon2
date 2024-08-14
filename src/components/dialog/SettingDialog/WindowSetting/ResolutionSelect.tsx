import { createSignal } from 'solid-js';
import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window';
import { useStore } from '@nanostores/solid';

import { $windowResolution, setWindowResolution } from '@/store/settingDialog';

import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { SimpleSelect, type ValueChangeDetails } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

import {
  WindowResolutions,
  getResolutionOption,
  type Resolution,
  type ResolutionOption,
} from '@/const/setting/window';

export const ResolutionSelect = () => {
  const settingResolution = useStore($windowResolution);
  const [localResolution, setLocalResolution] = createSignal<
    ResolutionOption | undefined
  >(getResolutionOption(settingResolution()));

  const selectionValue = () => {
    const name = localResolution()?.name;
    return name ? [name] : [];
  };

  const isDifferentResolution = () => {
    const local = localResolution();
    return !!local && local.name !== settingResolution();
  };

  function handleChange(details: ValueChangeDetails) {
    setLocalResolution(getResolutionOption(details.value[0] as Resolution));
  }

  async function handleSave() {
    const local = localResolution();
    if (local && isDifferentResolution()) {
      const currentWindow = getCurrentWindow();
      await currentWindow.setSize(new LogicalSize(local.width, local.height));
      setWindowResolution(local.name);
    }
  }

  return (
    <HStack>
      <Text as="label" for="resolution-select" textWrap="nowrap">
        解析度
      </Text>
      <SimpleSelect
        id="resolution-select"
        value={selectionValue()}
        items={WindowResolutions.map((resolution) => ({
          value: resolution.name,
          label: resolution.name,
        }))}
        onValueChange={handleChange}
        positioning={{ sameWidth: true }}
      />
      <Button onClick={handleSave} disabled={!isDifferentResolution()}>
        套用
      </Button>
    </HStack>
  );
};
