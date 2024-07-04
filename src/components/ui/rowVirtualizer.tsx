import { For, createMemo, type JSX, Show, createEffect } from 'solid-js';

import { createVirtualizer } from '@tanstack/solid-virtual';

import { Flex } from 'styled-system/jsx/flex';

export interface RowVirtualizerProps<Item> {
  columnCount: number;
  data: Item[];
  defaultItemHeight?: number;
  renderItem: (item: Item, index: number) => JSX.Element;
}
export function RowVirtualizer<Item>(props: RowVirtualizerProps<Item>) {
  let parentRef!: HTMLDivElement;

  const count = createMemo(() =>
    Math.ceil(props.data.length / props.columnCount),
  );

  const columnWidth = createMemo(() => 100 / props.columnCount);

  const timesArray = createMemo(() =>
    Array.from({ length: props.columnCount }),
  );

  const defaultItemHeight = createMemo(() => props.defaultItemHeight ?? 45);

  const virtualizer = createVirtualizer({
    get count() {
      return count();
    },
    getScrollElement: () => parentRef,
    estimateSize: () => defaultItemHeight(),
    overscan: 3,
  });

  createEffect(() => {
    const _ = count();
    virtualizer.scrollToOffset(0);
  });

  // const items = virtualizer.getVirtualItems();

  return (
    <div ref={parentRef} style={{ height: '100%', overflow: 'auto' }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        <For each={virtualizer.getVirtualItems()}>
          {(virtualRow, i) => {
            return (
              <Flex
                data-index={virtualRow.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                  'z-index': virtualizer.getVirtualItems().length - i(),
                }}
              >
                <For each={timesArray()}>
                  {(_, index) => {
                    const data = () =>
                      props.data[
                        virtualRow.index * props.columnCount + index()
                      ];
                    return (
                      <Flex justify="center" flex={1}>
                        <Show when={data()}>
                          {props.renderItem(data(), index())}
                        </Show>
                      </Flex>
                    );
                  }}
                </For>
              </Flex>
            );
          }}
        </For>
      </div>
    </div>
  );
}
