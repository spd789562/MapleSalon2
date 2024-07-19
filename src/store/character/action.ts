import {
  type CharacterData,
  $currentItem,
  $currentCharacterItems,
  $currentCharacterInfo,
  $currentItemChanges,
} from './store';
import {
  $totalItems,
  getCurrentHairColor,
  getCurrentFaceColor,
} from './selector';
import { removeItems } from '@/store/currentEquipDrawer';
import { getEquipById, appendHistory } from '@/store/string';
import { getCharacterSubCategory } from './utils';

import {
  getHairColorId,
  gatHairAvailableColorIds,
  changeHairColorId,
  getFaceColorId,
  gatFaceAvailableColorIds,
  changeFaceColorId,
} from '@/utils/mixDye';
import { getSubCategory, getBodyId, getHeadIdFromBodyId } from '@/utils/itemId';

import { EquipCategory, type EquipSubCategory } from '@/const/equipments';

export function changeCurrentCharacter(character: Partial<CharacterData>) {
  if (character.items) {
    $currentCharacterItems.set(character.items);
    const updateInfo = { ...$currentCharacterInfo.get() };
    if (character.id) {
      updateInfo.id = character.id;
    }
    if (character.action) {
      updateInfo.action = character.action;
    }
    if (character.expression) {
      updateInfo.expression = character.expression;
    }
    if (character.earType) {
      updateInfo.earType = character.earType;
    }
    if (character.handType) {
      updateInfo.handType = character.handType;
    }
    $currentCharacterInfo.set(updateInfo);

    $currentItemChanges.set({});
  }
}

export function applyCharacterChanges() {
  $currentCharacterItems.set($currentItemChanges.get());
  $currentItemChanges.set({});
}

export function updateChangesSkin(item: {
  id: number;
  name: string;
}) {
  const bodyId = getBodyId(item.id);
  const headId = getHeadIdFromBodyId(bodyId);

  const currentChanges = $totalItems.get();

  $currentItemChanges.setKey(
    'Body',
    Object.assign({}, currentChanges.Body, { id: bodyId, name: item.name }),
  );
  $currentItemChanges.setKey(
    'Head',
    Object.assign({}, currentChanges.Head, { id: headId, name: item.name }),
  );
}

const getColorItemUseSameColor =
  <ColorType extends number>(
    getCurrentColor: () => ColorType,
    getColorId: (id: number) => ColorType,
    getAvailableColorIds: (id: number) => number[],
    changeColorId: (id: number, color: ColorType) => number,
  ) =>
  (item: { id: number; name: string }) => {
    const currentItemColor = getCurrentColor();
    const itemColor = getColorId(item.id);

    const itemInfo = Object.assign({}, item);

    if (itemColor !== currentItemColor) {
      itemInfo.id = changeColorId(item.id, currentItemColor);
      const avaiableColorIds = getAvailableColorIds(item.id);

      /* if color is not available, use the first one */
      if (!avaiableColorIds.includes(itemInfo.id)) {
        itemInfo.id = avaiableColorIds[0];
      }

      const newEquipInfo = getEquipById(itemInfo.id);

      if (newEquipInfo) {
        itemInfo.name = newEquipInfo.name;
      }
    }

    return itemInfo;
  };

export const getHairItemUseSameColor = getColorItemUseSameColor(
  getCurrentHairColor,
  getHairColorId,
  gatHairAvailableColorIds,
  changeHairColorId,
);

export const getFaceItemUseSameColor = getColorItemUseSameColor(
  getCurrentFaceColor,
  getFaceColorId,
  gatFaceAvailableColorIds,
  changeFaceColorId,
);

export function addItemToChangesIfNeeded(item: {
  id: number;
  name: string;
}) {
  let category = getSubCategory(item.id);
  if (!category) {
    return;
  }
  category = getCharacterSubCategory(category);
  if (!category) {
    return;
  }

  const currentItems = $currentItemChanges.get();

  const currentItem = currentItems[category];

  if (currentItem?.id === item.id) {
    return;
  }

  if (currentItem) {
    return $currentItemChanges.setKey(
      category,
      Object.assign({}, currentItem, {
        id: item.id,
        name: item.name,
        isDeleted: false,
      }),
    );
  }

  const originItem = $currentCharacterItems.get()[category];

  if (originItem) {
    $currentItemChanges.setKey(
      category,
      Object.assign({}, originItem, {
        id: item.id,
        name: item.name,
        isDeleted: false,
      }),
    );
  } else {
    $currentItemChanges.setKey(category, {
      id: item.id,
      name: item.name,
      isDeleted: false,
    });
  }
}

export function addItemToChanges(
  category: EquipSubCategory,
  item: {
    id: number;
    name: string;
  },
) {
  const currentItems = $totalItems.get();

  if (currentItems[category]) {
    $currentItemChanges.setKey(
      category,
      Object.assign({}, currentItems[category], {
        id: item.id,
        name: item.name,
        isDeleted: false,
      }),
    );
  } else {
    $currentItemChanges.setKey(category, {
      id: item.id,
      name: item.name,
      isDeleted: false,
    });
  }
}

export function selectNewItem(item: { id: number; name: string }) {
  let category = getSubCategory(item.id);
  if (!category) {
    return;
  }
  category = getCharacterSubCategory(category);
  if (!category) {
    return;
  }

  /* append to history */
  appendHistory({
    category: EquipCategory.Unknown,
    id: item.id,
    name: item.name,
  });

  if (category === 'Hair') {
    const itemInfo = getHairItemUseSameColor(item);
    const originItem = $totalItems.get().Hair;
    $currentItem.set(itemInfo);
    $currentItemChanges.setKey('Hair', {
      id: itemInfo.id,
      name: itemInfo.name,
      dye: Object.assign({}, originItem?.dye),
      isDeleted: false,
      isDeleteDye: !!originItem?.isDeleteDye,
    });
    return;
  }

  if (category === 'Face') {
    const itemInfo = getFaceItemUseSameColor(item);
    const originItem = $totalItems.get().Face;
    $currentItem.set(itemInfo);
    $currentItemChanges.setKey('Face', {
      id: itemInfo.id,
      name: itemInfo.name,
      dye: Object.assign({}, originItem?.dye),
      isDeleted: false,
      isDeleteDye: !!originItem?.isDeleteDye,
    });
    return;
  }

  $currentItem.set(item);

  if (category === 'Skin') {
    return updateChangesSkin(item);
  }

  /* remove conflict category */
  if (category === 'Coat' || category === 'Pants') {
    removeItems('Overall');
  } else if (category === 'Longcoat' || category === 'Overall') {
    removeItems('Coat');
    removeItems('Pants');
  }

  return addItemToChanges(category, item);
}

export function updateItemHsvInfo(
  category: EquipSubCategory,
  field: 'colorRange' | 'hue' | 'saturation' | 'brightness',
  value: number,
) {
  const hasChanges = $currentItemChanges.get()[category];
  if (hasChanges) {
    $currentItemChanges.setKey(`${category}.${field}`, value);
  } else {
    const currentItem = $totalItems.get()[category];

    if (!currentItem) {
      return;
    }

    /* fill the changes first and then modify the value */
    $currentItemChanges.setKey(
      category,
      Object.assign({}, currentItem, {
        [field]: value,
      }),
    );
  }
}
export function resetItemHsvInfo(category: EquipSubCategory) {
  const currentItems = $totalItems.get();
  const originItem = currentItems[category];
  if (originItem) {
    $currentItemChanges.setKey(
      category,
      Object.assign({}, originItem, {
        colorRange: 0,
        hue: 0,
        saturation: 0,
        brightness: 0,
      }),
    );
  }
}
