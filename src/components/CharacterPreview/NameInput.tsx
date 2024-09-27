import { useStore } from '@nanostores/solid';

import { $currentName } from '@/store/character/selector';
import { setCharacterName } from '@/store/character/action';

import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';

import { debounce } from 'throttle-debounce';

export interface NameInputProps {
  id?: string;
}
export const NameInput = (props: NameInputProps) => {
  const name = useStore($currentName);

  const handleNameChange = debounce(300, (value: string) => {
    setCharacterName(value);
  });

  return (
    <HStack>
      <Text as="label" for={props.id ?? "character-name"}>角色名稱</Text>
      <Input
        id={props.id ?? "character-name"}
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
