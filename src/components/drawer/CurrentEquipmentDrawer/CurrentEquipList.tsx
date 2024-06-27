import { Index } from 'solid-js';
import { VStack } from 'styled-system/jsx/vstack';
import { EquipItem } from './EquipItem';
import type { EquipSubCategory } from '@/const/equipments';

const CategoryList = [
  'Head',
  'Hair',
  'Face',
  'Weapon',
  'Cap',
  'Cape',
  'Coat',
  'Glove',
  'Overall',
  'Pants',
  'Shield',
  'Shoes',
  'Face Accessory',
  'Eye Decoration',
  'Earrings',
] as EquipSubCategory[];

export const CurrentEquipList = () => {
  return (
    <VStack gap={2}>
      <Index each={CategoryList}>
        {(category) => <EquipItem category={category()} />}
      </Index>
    </VStack>
  );
};
