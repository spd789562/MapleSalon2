import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $currentExpression } from '@/store/character/selector';
import { setCharacterExpression } from '@/store/character/action';

import { SimpleSelect, type ValueChangeDetails } from '@/components/ui/select';

import { CharacterExpressions } from '@/const/emotions';

export const ExpressionSelect = () => {
  const t = useTranslate();
  const action = useStore($currentExpression);
  function handleActionChange(details: ValueChangeDetails) {
    const firstItem = details.value?.[0];
    firstItem && setCharacterExpression(firstItem as CharacterExpressions);
  }

  const options = [
    {
      label: t('character.expressionDefault'),
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
      label: t('character.expressionHum'),
      value: CharacterExpressions.Hum,
    },
    {
      label: t('character.expressionDespair'),
      value: CharacterExpressions.Despair,
    },
    {
      label: t('character.expressionOops'),
      value: CharacterExpressions.Oops,
    },
    {
      label: t('character.expressionVomit'),
      value: CharacterExpressions.Vomit,
    },
    {
      label: t('character.expressionBowing'),
      value: CharacterExpressions.Bowing,
    },
    {
      label: t('character.expressionDam'),
      value: CharacterExpressions.Dam,
    },
    {
      label: t('character.expressionPain'),
      value: CharacterExpressions.Pain,
    },
    {
      label: t('character.expressionHot'),
      value: CharacterExpressions.Hot,
    },
    {
      label: t('character.expressionCheers'),
      value: CharacterExpressions.Cheers,
    },
    {
      label: t('character.expressionWink'),
      value: CharacterExpressions.Wink,
    },
    {
      label: t('character.expressionBlaze'),
      value: CharacterExpressions.Blaze,
    },
    {
      label: t('character.expressionChu'),
      value: CharacterExpressions.Chu,
    },
    {
      label: t('character.expressionShine'),
      value: CharacterExpressions.Shine,
    },
    {
      label: t('character.expressionGlitter'),
      value: CharacterExpressions.Glitter,
    },
    {
      label: t('character.expressionLove'),
      value: CharacterExpressions.Love,
    },
    {
      label: t('character.expressionQblue'),
      value: CharacterExpressions.QBlue,
    },
  ];

  return (
    <SimpleSelect
      positioning={{
        sameWidth: true,
      }}
      items={options}
      value={[action()]}
      onValueChange={handleActionChange}
      groupTitle={t('character.expressionTitle')}
      maxHeight="20rem"
    />
  );
};
