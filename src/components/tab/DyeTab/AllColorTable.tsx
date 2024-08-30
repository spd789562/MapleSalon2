import { For } from 'solid-js';

import * as Table from '@/components/ui/table';
import { ColorBlock } from './styledComponents';
import { DyeCharacter } from './DyeCharacter';

export interface AllColorTableProps {
  category: 'Hair' | 'Face';
  avaialbeColorIds: number[];
  getColorHex: (colorId: number) => string;
  showFullCharacter?: boolean;
  refs?: HTMLImageElement[];
}
export const AllColorTable = (props: AllColorTableProps) => {
  function handleRef(i: number) {
    return (element: HTMLImageElement) => {
      if (!props.refs) {
        return;
      }
      props.refs[i] = element;
    };
  }

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
            {(colorId, i) => (
              <Table.Cell p="2" overflow="hidden" textAlign="center">
                <DyeCharacter
                  category={props.category}
                  ovrrideId={colorId}
                  showFullCharacter={props.showFullCharacter}
                  ref={handleRef(i())}
                />
              </Table.Cell>
            )}
          </For>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
};
