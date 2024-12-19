import { useStore } from '@nanostores/solid';
import { usePureStore } from '@/store';

import {
  $mapFilterdStrings,
  $selectedMap,
  $mapListLastOffset,
} from '@/store/mapleMap';

import { RowVirtualizer } from '@/components/ui/rowVirtualizer';
import { MapRowItem } from './MapRowItem';

const DEFATULE_HEIGHT = 36;

export const MapList = () => {
  const mapStrings = usePureStore($mapFilterdStrings);
  const selectedMap = useStore($selectedMap);

  return (
    <RowVirtualizer
      defaultItemHeight={DEFATULE_HEIGHT}
      columnCount={1}
      renderItem={(item) => (
        <MapRowItem item={item} selected={selectedMap()?.id === item.id} />
      )}
      data={mapStrings()}
      restoreAtom={$mapListLastOffset}
    />
  );
};
