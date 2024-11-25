import { For, from } from 'solid-js';
import { usePureStore } from '@/store';
import { styled } from 'styled-system/jsx/factory';

import { $userUploadedSceneImages, $currentSelectScene } from '@/store/scene';

import { Grid } from 'styled-system/jsx/grid';

const UPLOAD_HISTORY_COLUMNS = 8;

export const UploadHistory = () => {
  const uploadedSceneImages = from($userUploadedSceneImages);

  function handleSelectScene(scene: string[]) {
    $currentSelectScene.set(scene[1]);
  }

  return (
    <Grid columns={UPLOAD_HISTORY_COLUMNS} gap="1">
      <For each={uploadedSceneImages()}>
        {(scene) => (
          <SceneButton
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
  },
});
