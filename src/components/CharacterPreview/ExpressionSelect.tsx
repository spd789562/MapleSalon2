import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';
import { useLocalizedOptions } from '@/hook/useLocalizedOptions';

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

  const options = useLocalizedOptions([
    {
      label: 'character.expressionDefault',
      value: CharacterExpressions.Default,
    },
    { label: 'F1(hit)', value: CharacterExpressions.Hit },
    { label: 'F2(smile)', value: CharacterExpressions.Smile },
    { label: 'F3(troubled)', value: CharacterExpressions.Troubled },
    { label: 'F4(cry)', value: CharacterExpressions.Cry },
    { label: 'F5(angry)', value: CharacterExpressions.Angry },
    { label: 'F6(bewildered)', value: CharacterExpressions.Bewildered },
    { label: 'F7(stunned)', value: CharacterExpressions.Stunned },
    { label: 'character.expressionHum', value: CharacterExpressions.Hum },
    {
      label: 'character.expressionDespair',
      value: CharacterExpressions.Despair,
    },
    { label: 'character.expressionOops', value: CharacterExpressions.Oops },
    { label: 'character.expressionVomit', value: CharacterExpressions.Vomit },
    { label: 'character.expressionBowing', value: CharacterExpressions.Bowing },
    { label: 'character.expressionDam', value: CharacterExpressions.Dam },
    { label: 'character.expressionPain', value: CharacterExpressions.Pain },
    { label: 'character.expressionHot', value: CharacterExpressions.Hot },
    { label: 'character.expressionCheers', value: CharacterExpressions.Cheers },
    { label: 'character.expressionWink', value: CharacterExpressions.Wink },
    { label: 'character.expressionBlaze', value: CharacterExpressions.Blaze },
    { label: 'character.expressionChu', value: CharacterExpressions.Chu },
    { label: 'character.expressionShine', value: CharacterExpressions.Shine },
    {
      label: 'character.expressionGlitter',
      value: CharacterExpressions.Glitter,
    },
    { label: 'character.expressionLove', value: CharacterExpressions.Love },
    { label: 'character.expressionQblue', value: CharacterExpressions.QBlue },
  ]);

  return (
    <SimpleSelect
      positioning={{
        sameWidth: true,
      }}
      items={options()}
      value={[action()]}
      onValueChange={handleActionChange}
      groupTitle={t('character.expressionTitle')}
      maxHeight="20rem"
    />
  );
};
