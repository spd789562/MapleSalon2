import { Grid } from 'styled-system/jsx/grid';
import { CharacterSelectionDrawer as Drawer } from './CharacterSelectionDrawer';
import { CharacterList } from './CharacterList';
import { AddDefaultCharacterButton } from './AddDefaultCharacterButton';

export const CharacterSelectionDrawer = () => {
  return (
    <Drawer
      variant="top"
      body={
        <Grid gridTemplateColumns="1fr auto" gap="2" height="[100%]">
          <CharacterList />
          <Grid gridTemplateRows="1fr auto" gap="1.5">
            <AddDefaultCharacterButton />
            <div>upload</div>
          </Grid>
        </Grid>
      }
    />
  );
};
