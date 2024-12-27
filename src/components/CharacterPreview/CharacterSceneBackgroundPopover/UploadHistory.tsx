import { For, from } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';
import { useTranslate } from '@/context/i18n';

import {
  $userUploadedSceneImages,
  $currentCustomScene,
  $currentScene,
} from '@/store/scene';

import { Grid } from 'styled-system/jsx/grid';
import { PreviewScene } from '@/const/scene';

const UPLOAD_HISTORY_COLUMNS = 8;

export const UploadHistory = () => {
  const t = useTranslate();
  const uploadedSceneImages = from($userUploadedSceneImages);

  function handleSelectScene(scene: string[]) {
    $currentCustomScene.set(scene[1]);
    if ($currentScene.get() !== PreviewScene.Custom) {
      $currentScene.set(PreviewScene.Custom);
    }
  }

  return (
    <Grid columns={UPLOAD_HISTORY_COLUMNS} gap="1">
      <For each={uploadedSceneImages()}>
        {(scene) => (
          <SceneButton
            title={t('scene.customSelectThis')}
            onClick={() => handleSelectScene(scene)}
            style={{ 'background-image': `url(${scene[1]})` }}
          />
        )}
      </For>
    </Grid>
  );
};

const SceneButton = styled('button', {
  base: {
    borderRadius: 'md',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    overflow: 'hidden',
    width: '100%',
    paddingTop: '100%',
    cursor: 'pointer',
  },
});
