import { For, createMemo, onMount, type JSX, Show } from 'solid-js';

import { createVirtualizer } from '@tanstack/solid-virtual';

import { Flex } from 'styled-system/jsx/flex';

export interface RowVirtualizerProps<Item> {
  columnCount: number;
  data: Item[];
  defaultItemHeight?: number;
  renderItem: (item: Item) => JSX.Element;
}
export function RowVirtualizer<Item>(props: RowVirtualizerProps<Item>) {
  let parentRef!: HTMLDivElement;

  const count = createMemo(() =>
    Math.ceil(props.data.length / props.columnCount),
  );

  const columnWidth = createMemo(() => 100 / props.columnCount);

  const timesArray = Array.from({ length: props.columnCount });

  const defaultItemHeight = props.defaultItemHeight ?? 45;

  const virtualizer = createVirtualizer({
    get count() {
      return count();
    },
    getScrollElement: () => parentRef,
    estimateSize: () => defaultItemHeight,
  });

  const items = virtualizer.getVirtualItems();

  return (
    <div ref={parentRef} style={{ height: '100%', overflow: 'auto' }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${items[0]?.start ?? 0}px)`,
          }}
        >
          <For each={items}>
            {(virtualRow) => {
              let ref!: HTMLDivElement;
              onMount(() => virtualizer.measureElement(ref));

              return (
                <Flex ref={ref} data-index={virtualRow.index}>
                  <For each={timesArray}>
                    {(_, index) => {
                      const data = () =>
                        props.data[
                          virtualRow.index * props.columnCount + index()
                        ];
                      return (
                        <div
                          style={{
                            width: `${columnWidth()}%`,
                            'min-height': `${defaultItemHeight}px`,
                          }}
                        >
                          <Show when={data()}>{props.renderItem(data())}</Show>
                        </div>
                      );
                    }}
                  </For>
                </Flex>
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );
}
