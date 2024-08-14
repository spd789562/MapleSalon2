import { Index, Show } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { $theme, setTheme } from '@/store/settingDialog';

import { Grid } from 'styled-system/jsx/grid';
import * as RadioButtonGroup from '@/components/ui/radioButtonGroup';
import CheckIcon from 'lucide-solid/icons/check';

import { Theme, ThemeColor, syncTheme } from '@/const/setting/theme';

const ThemeList = [
  Theme.Crimson,
  Theme.Tomato,
  Theme.Orange,
  Theme.Amber,
  Theme.Grass,
  Theme.Cyan,
  Theme.Sky,
  Theme.Iris,
  Theme.Plum,
];

const options = ThemeList.map((theme) => ({
  value: theme,
  backgroundColor: ThemeColor[theme],
}));

export const ThemeRadioGroup = () => {
  const theme = useStore($theme);

  function handleChange(details: RadioButtonGroup.ValueChangeDetails) {
    const selectTheme = details.value as Theme;
    if (selectTheme === theme()) {
      return;
    }
    syncTheme(selectTheme);
    setTheme(selectTheme);
  }

  return (
    <RadioButtonGroup.Root
      variant="outline"
      size="sm"
      value={theme()}
      onValueChange={handleChange}
    >
      <Grid columns={9} gap={1}>
        <Index each={options}>
          {(option) => (
            <RadioButtonGroup.Item
              value={option().value}
              color="accent.fg"
              width="6"
              height="6"
              padding="unset"
              minWidth="unset"
              bgColor={`${option().backgroundColor}`}
            >
              <RadioButtonGroup.ItemControl />
              <RadioButtonGroup.ItemHiddenInput />
              <RadioButtonGroup.ItemText>
                <RadioButtonGroup.Context>
                  {(context) => (
                    <Show when={context().value === option().value}>
                      <CheckIcon />
                    </Show>
                  )}
                </RadioButtonGroup.Context>
              </RadioButtonGroup.ItemText>
            </RadioButtonGroup.Item>
          )}
        </Index>
      </Grid>
    </RadioButtonGroup.Root>
  );
};
