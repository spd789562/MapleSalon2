import type { Filter, Container } from 'pixi.js';

export function applyFilterToContainer(container: Container, filter: Filter) {
  if (Array.isArray(container.filters)) {
    container.filters = [...container.filters, filter];
  } else if (container.filters) {
    container.filters = [container.filters, filter];
  } else {
    container.filters = [filter];
  }
}

export function removeFilterFromContainer(
  container: Container,
  filter: Filter,
) {
  if (Array.isArray(container.filters)) {
    container.filters = container.filters.filter((f) => f !== filter);
  } else if (container.filters && container.filters === filter) {
    container.filters = [];
  }
}
