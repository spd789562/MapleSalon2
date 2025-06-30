import { ark } from '@ark-ui/solid/factory';
import type { ComponentProps } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';
import { badge } from 'styled-system/recipes/badge';

export type BadgeProps = ComponentProps<typeof Badge>;
export const Badge = styled(ark.div, badge);
