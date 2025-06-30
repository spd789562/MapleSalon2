import type { Assign } from '@ark-ui/solid';
import { Dialog } from '@ark-ui/solid/dialog';
import { type DialogVariantProps, dialog } from 'styled-system/recipes/dialog';
import type { JsxStyleProps } from 'styled-system/types';
import { createStyleContext } from '@/utils/create-style-context';

const { withRootProvider, withContext } = createStyleContext(dialog);

export interface RootProps extends Dialog.RootProps, DialogVariantProps {}
export const Root = withRootProvider<RootProps>(Dialog.Root);

export const Backdrop = withContext<
  Assign<JsxStyleProps, Dialog.BackdropProps>
>(Dialog.Backdrop, 'backdrop');

export const CloseTrigger = withContext<
  Assign<JsxStyleProps, Dialog.CloseTriggerProps>
>(Dialog.CloseTrigger, 'closeTrigger');

export const Content = withContext<Assign<JsxStyleProps, Dialog.ContentProps>>(
  Dialog.Content,
  'content',
);

export const Description = withContext<
  Assign<JsxStyleProps, Dialog.DescriptionProps>
>(Dialog.Description, 'description');

export const Positioner = withContext<
  Assign<JsxStyleProps, Dialog.PositionerProps>
>(Dialog.Positioner, 'positioner');

export const Title = withContext<Assign<JsxStyleProps, Dialog.TitleProps>>(
  Dialog.Title,
  'title',
);

export const Trigger = withContext<Assign<JsxStyleProps, Dialog.TriggerProps>>(
  Dialog.Trigger,
  'trigger',
);

export {
  DialogContext as Context,
  type DialogContextProps as ContextProps,
  type DialogOpenChangeDetails as OpenChangeDetails,
} from '@ark-ui/solid/dialog';
