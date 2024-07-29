import { For } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';

import * as Table from '@/components/ui/table';
import { DyeCharacter } from './DyeCharacter';

export interface AllColorTableProps {
  avaialbeColorIds: number[];
  getColorHex: (colorId: number) => string;
  showFullCharacter?: boolean;
}
export const AllColorTable = (props: AllColorTableProps) => {
  return (
    <Table.Root>
      <Table.Head>
        <Table.Row>
          <For each={props.avaialbeColorIds}>
            {(colorId) => (
              <Table.Header textAlign="center">
                <ColorBlock
                  style={{ 'background-color': props.getColorHex(colorId) }}
                />
              </Table.Header>
            )}
          </For>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <For each={props.avaialbeColorIds}>
            {(colorId) => (
              <Table.Cell overflow="hidden" textAlign="center">
                <DyeCharacter
                  category="Hair"
                  hairOverrideId={colorId}
                  showFullCharacter={props.showFullCharacter}
                />
              </Table.Cell>
            )}
          </For>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
};

export const ColorBlock = styled('div', {
  base: {
    borderRadius: 'md',
    boxShadow: 'md',
    w: 6,
    h: 6,
    display: 'inline-block',
  },
});
