import type { Store, StoreValue } from 'nanostores';
import { onCleanup, createEffect } from 'solid-js';
import type { Accessor } from 'solid-js';
import { createStore } from 'solid-js/store';

/**
 * it different from useStore from @nanostores/solid, it not using reconcil to merge the store value
 */
export function usePureStore<
  SomeStore extends Store,
  Value extends StoreValue<SomeStore>,
>(store: SomeStore): Accessor<Value> {
  const [value, setValue] = createStore({ value: store.get() });

  const unsubscribe = store.subscribe((nv) => {
    setValue('value', nv);
  });

  onCleanup(() => {
    unsubscribe?.();
  });

  return () => value.value;
}

/**
 * useDynamicPureStore can provide a accessor to a store, when the provide accessor change, will subscribe to the new store
 */
export function useDynamicPureStore<
  SomeStore extends Store,
  Value extends StoreValue<SomeStore>,
>(store: Accessor<SomeStore>): Accessor<Value> {
  const [value, setValue] = createStore({ value: store().get() });
  let unsubscribe: () => void;

  createEffect(() => {
    setValue('value', store().get());
    unsubscribe?.();
    unsubscribe = store().listen((nv) => {
      setValue('value', nv);
    });
  });

  onCleanup(() => {
    unsubscribe?.();
  });

  return () => value.value;
}
