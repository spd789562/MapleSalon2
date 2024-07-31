import { For } from 'solid-js';

import * as Table from '@/components/ui/table';
import { ColorBlock } from './styledComponents';
import { DyeCharacter } from './DyeCharacter';
import { DyeInfo } from './DyeInfo';

export interface MixDyeTableProps {
  category: 'Hair' | 'Face';
  avaialbeColorIds: number[];
  getColorHex: (colorId: number) => string;
  getColorId: (colorId: number) => number;
  showFullCharacter?: boolean;
  refs?: HTMLImageElement[];
}
export const MixDyeTable = (props: MixDyeTableProps) => {
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
          <Table.Header />
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
        <For each={props.avaialbeColorIds}>
          {(mixColorId, y) => (
            <Table.Row>
              <Table.Cell p="2" textAlign="center">
                <ColorBlock
                  style={{ 'background-color': props.getColorHex(mixColorId) }}
                />
              </Table.Cell>
              <For each={props.avaialbeColorIds}>
                {(colorId, x) => (
                  <Table.Cell p="2" overflow="hidden" textAlign="center">
                    <DyeCharacter
                      category={props.category}
                      ovrrideId={colorId}
                      showFullCharacter={props.showFullCharacter}
                      dyeId={props.getColorId(mixColorId)}
                      dyeInfo={
                        <DyeInfo
                          originHex={props.getColorHex(colorId)}
                          dyeHex={props.getColorHex(mixColorId)}
                          dyeAlpha={50}
                        />
                      }
                      ref={handleRef(x() + y() * props.avaialbeColorIds.length)}
                    />
                  </Table.Cell>
                )}
              </For>
            </Table.Row>
          )}
        </For>
      </Table.Body>
    </Table.Root>
  );
};
