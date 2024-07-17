import { onSet } from 'nanostores';

import { appendHistory } from '@/store/string';
import { $currentItem } from './store';
import { updateChangesSkin } from './action';
import { getCharacterSubCategory } from './utils';

import { getSubCategory } from '@/utils/itemId';

import { EquipCategory } from '@/const/equipments';

onSet($currentItem, ({ newValue, abort }) => {
  if (!newValue) {
    return;
  }
  let category = getSubCategory(newValue.id);
  if (!category) {
    return abort();
  }

  /* append to history */
  appendHistory({
    category: EquipCategory.Unknown,
    id: newValue.id,
    name: newValue.name,
  });

  category = getCharacterSubCategory(category);

  if (category === 'Skin') {
    updateChangesSkin(newValue);
  }
});
