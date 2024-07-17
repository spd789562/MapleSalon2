import {
  type CharacterData,
  $currentCharacterItems,
  $currentCharacterInfo,
  $currentItemChanges,
} from './store';
import { getCharacterSubCategory } from './utils';

import { getSubCategory, getBodyId, getHeadIdFromBodyId } from '@/utils/itemId';

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

  $currentItemChanges.setKey('Body.id', bodyId);
  $currentItemChanges.setKey('Body.name', item.name);

  $currentItemChanges.setKey('Head.id', headId);
  $currentItemChanges.setKey('Head.name', item.name);
}

/* @TODO: hair and face should use original color and dye so probably need to read changes */
export function addItemToChanges(item: {
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

  const currentItems = $currentCharacterItems.get();

  if (currentItems[category] && currentItems[category]?.id === item.id) {
    return;
  }

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
