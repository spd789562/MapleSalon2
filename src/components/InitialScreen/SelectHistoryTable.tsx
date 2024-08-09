import { Index, Show } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';

import { usePureStore } from '@/store';
import { $savedFileSelectHistory } from '@/store/fileSelectHistory';

import { HStack } from 'styled-system/jsx/hstack';
import * as Table from '@/components/ui/table';
import { EllipsisText } from '@/components/ui/ellipsisText';
import { DeletePathButton } from './DeletePathButton';
import { OpenPathButton } from './OpenPathButton';
import { LoadPathButton } from './LoadPathButton';

export const SelectHistoryTable = () => {
  const pathList = usePureStore($savedFileSelectHistory);

  return (
    <Show
      when={pathList().length}
      fallback={<EmptyBlock>尚無選擇紀錄</EmptyBlock>}
    >
      <Table.Root tableLayout="fixed">
        <Table.Head>
          <Table.Row>
            <Table.Header width="3rem" />
            <Table.Header>路徑</Table.Header>
            <Table.Header width="11rem" />
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Index each={pathList()}>
            {(path) => (
              <Table.Row>
                <Table.Cell px="2">
                  <DeletePathButton path={path()} />
                </Table.Cell>
                <Table.Cell title={path()}>
                  <EllipsisText>{path()}</EllipsisText>
                </Table.Cell>
                <Table.Cell>
                  <HStack justify="flex-end">
                    <OpenPathButton path={path()} />
                    <LoadPathButton path={path()} />
                  </HStack>
                </Table.Cell>
              </Table.Row>
            )}
          </Index>
        </Table.Body>
      </Table.Root>
    </Show>
  );
};

export const EmptyBlock = styled('div', {
  base: {
    w: 'full',
    py: 8,
    border: '3px dashed',
    borderColor: 'bg.emphasized',
    borderRadius: 'md',
    textAlign: 'center',
    color: 'fg.subtle',
    fontSize: 'md',
  },
});
