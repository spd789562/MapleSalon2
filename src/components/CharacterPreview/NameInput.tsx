import { useStore } from '@nanostores/solid';

import { $currentName } from '@/store/character/selector';
import { setCharacterName } from '@/store/character/action';

import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';

import { debounce } from 'throttle-debounce';

export const NameInput = () => {
  const name = useStore($currentName);

  const handleNameChange = debounce(300, (value: string) => {
    setCharacterName(value);
  });

  return (
    <HStack ml="2">
      <Text>角色名稱</Text>
      <Input
        placeholder="輸入角色名稱"
        value={name()}
        onInput={(e) => handleNameChange(e.target.value)}
        minWidth={7}
        flex={1}
        size="sm"
      />
    </HStack>
  );
};
