import { useStore } from '@nanostores/solid';

import { $currentCharacterInfo } from '@/store/character/store';
import { $currentExpression } from '@/store/character/selector';

import { SimpleSelect, type ValueChangeDetails } from '@/components/ui/select';

import { CharacterExpressions } from '@/const/emotions';

const options = [
  {
    label: '預設',
    value: CharacterExpressions.Default,
  },
  {
    label: 'F1(hit)',
    value: CharacterExpressions.Hit,
  },
  {
    label: 'F2(smile)',
    value: CharacterExpressions.Smile,
  },
  {
    label: 'F3(troubled)',
    value: CharacterExpressions.Troubled,
  },
  {
    label: 'F4(cry)',
    value: CharacterExpressions.Cry,
  },
  {
    label: 'F5(angry)',
    value: CharacterExpressions.Angry,
  },
  {
    label: 'F6(bewildered)',
    value: CharacterExpressions.Bewildered,
  },
  {
    label: 'F7(stunned)',
    value: CharacterExpressions.Stunned,
  },
  {
    label: '沉思',
    value: CharacterExpressions.Hum,
  },
  {
    label: '難以接受',
    value: CharacterExpressions.Despair,
  },
  {
    label: '汗',
    value: CharacterExpressions.Oops,
  },
  {
    label: '嘔吐',
    value: CharacterExpressions.Vomit,
  },
  {
    label: '打瞌睡',
    value: CharacterExpressions.Bowing,
  },
  {
    label: '吐舌頭',
    value: CharacterExpressions.Dam,
  },
  {
    label: '眼淚',
    value: CharacterExpressions.Pain,
  },
  {
    label: '好熱',
    value: CharacterExpressions.Hot,
  },
  {
    label: '哇賽',
    value: CharacterExpressions.Cheers,
  },
  {
    label: '眨眼',
    value: CharacterExpressions.Wink,
  },
  {
    label: '怒火中燒',
    value: CharacterExpressions.Blaze,
  },
  {
    label: '親親',
    value: CharacterExpressions.Chu,
  },
  {
    label: '閃閃發光',
    value: CharacterExpressions.Shine,
  },
  {
    label: '眼光閃爍',
    value: CharacterExpressions.Glitter,
  },
  {
    label: '一見鐘情',
    value: CharacterExpressions.Love,
  },
  {
    label: '寒冷',
    value: CharacterExpressions.QBlue,
  },
];

export const ExpressionSelect = () => {
  const action = useStore($currentExpression);
  function handleActionChange(details: ValueChangeDetails) {
    const firstItem = details.value?.[0];
    firstItem &&
      $currentCharacterInfo.setKey(
        'expression',
        firstItem as CharacterExpressions,
      );
  }

  return (
    <SimpleSelect
      positioning={{
        sameWidth: true,
      }}
      items={options}
      value={[action()]}
      onValueChange={handleActionChange}
      groupTitle="角色表情"
      maxHeight="20rem"
    />
  );
};
