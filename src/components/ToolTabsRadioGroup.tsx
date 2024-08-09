import { Index } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { styled } from 'styled-system/jsx/factory';

import { $toolTab } from '@/store/toolTab';

import CloseIcon from 'lucide-solid/icons/x';
import { Grid } from 'styled-system/jsx/grid';
import * as RadioButtonGroup from '@/components/ui/radioButtonGroup';
import { IconButton } from '@/components/ui/icon-button';

import { ToolTab, ToolTabNames } from '@/const/toolTab';

const options = [
  {
    value: ToolTab.AllAction,
    label: ToolTabNames[ToolTab.AllAction],
  },
  {
    value: ToolTab.HairDye,
    label: ToolTabNames[ToolTab.HairDye],
  },
  {
    value: ToolTab.FaceDye,
    label: ToolTabNames[ToolTab.FaceDye],
  },
];

export const ToolTabsRadioGroup = () => {
  const tab = useStore($toolTab);

  function handleChange(detail: RadioButtonGroup.ValueChangeDetails) {
    $toolTab.set(detail.value as ToolTab);
  }

  function handleClear() {
    $toolTab.set(undefined);
  }

  return (
    <ToolTabsContainer>
      <RadioButtonGroup.Root
        name="toolTab"
        value={tab()}
        onValueChange={handleChange}
      >
        <Grid
          gridTemplateColumns="2.5rem repeat(8, 1fr)"
          gridRow={1}
          alignItems="center"
          gap={2}
        >
          <RadioButtonGroup.Context>
            {(api) => (
              <IconButton
                variant="ghost"
                onClick={() => {
                  api().clearValue();
                  handleClear();
                }}
                title="清除篩選"
                disabled={tab() === undefined}
              >
                <CloseIcon />
              </IconButton>
            )}
          </RadioButtonGroup.Context>
          <Index each={options}>
            {(option) => (
              <RadioButtonGroup.Item value={option().value} minWidth="0">
                <RadioButtonGroup.ItemControl />
                <RadioButtonGroup.ItemHiddenInput />
                <RadioButtonGroup.ItemText>
                  {option().label}
                </RadioButtonGroup.ItemText>
              </RadioButtonGroup.Item>
            )}
          </Index>
        </Grid>
      </RadioButtonGroup.Root>
    </ToolTabsContainer>
  );
};

const ToolTabsContainer = styled('div', {
  base: {
    mt: 8,
    mb: 4,
    p: 2,
    borderRadius: 'md',
    boxShadow: 'md',
    backgroundColor: 'bg.default',
  },
});
