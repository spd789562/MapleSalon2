import type { Store, StoreValue } from 'nanostores';
import { createStore } from 'solid-js/store';
import type { Accessor } from 'solid-js';
import { onCleanup } from 'solid-js';

/**
 * it different from useStore from @nanostores/solid, it not using reconcil to merge the store value
 */
export function usePureStore<
  SomeStore extends Store,
  Value extends StoreValue<SomeStore>,
>(store: SomeStore): Accessor<Value> {
  const [value, setValue] = createStore({ value: store.get() });

  const unsubscribe = store.listen((nv) => {
    setValue('value', nv);
  });

  onCleanup(() => {
    unsubscribe();
  });

  return () => value.value;
}
