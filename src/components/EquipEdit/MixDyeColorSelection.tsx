import { Index, Show } from 'solid-js';

import { Grid } from 'styled-system/jsx/grid';
import * as RadioButtonGroup from '@/components/ui/radioButtonGroup';
import CheckIcon from 'lucide-solid/icons/check';

import {
  getHairColorId,
  gatHairAvailableColorIds,
  getFaceColorId,
  gatFaceAvailableColorIds,
  changeFormatedFaceColorId,
} from '@/utils/mixDye';

import { HairColorHex } from '@/const/hair';
import { FaceColorHex } from '@/const/face';

export interface MixDyeColorSelectionProps {
  value: string;
  onChange: (value: number) => void;
  options: { color: number; colorHex: string; disabled?: boolean }[];
  disabled?: boolean;
}
export const MixDyeColorSelection = (props: MixDyeColorSelectionProps) => {
  return (
    <RadioButtonGroup.Root
      variant="outline"
      size="sm"
      value={props.value}
      onValueChange={(d) => props.onChange(Number(d.value))}
      disabled={props.disabled}
      opacity={props.disabled ? 0.2 : 1}
    >
      <Grid columns={9} gap={1}>
        <Index each={props.options}>
          {(option) => (
            <RadioButtonGroup.Item
              value={option().color.toString()}
              disabled={option().disabled}
              color="accent.fg"
              width="8"
              height="8"
              padding="unset"
              minWidth="unset"
              style={{
                'background-color': option().colorHex,
              }}
            >
              <RadioButtonGroup.ItemControl />
              <RadioButtonGroup.ItemHiddenInput />
              <RadioButtonGroup.ItemText>
                <RadioButtonGroup.Context>
                  {(context) => (
                    <Show when={context().value === option().color.toString()}>
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

export function generateHairColorOptions(genericHairId: number) {
  const blackHair = genericHairId * 10;
  const avaiableColorIds = gatHairAvailableColorIds(blackHair);
  const result = [];
  for (const color of avaiableColorIds) {
    result.push({
      color,
      colorHex: HairColorHex[getHairColorId(color)],
    });
  }
  return result;
}
export function generateFaceColorOptions(genericFaceId: number) {
  const blackFace = changeFormatedFaceColorId(genericFaceId, 0);
  const avaiableColorIds = gatFaceAvailableColorIds(blackFace);
  const result = [];
  for (const color of avaiableColorIds) {
    result.push({
      color,
      colorHex: FaceColorHex[getFaceColorId(color)],
    });
  }
  return result;
}
