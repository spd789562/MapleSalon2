import { type Accessor, createEffect, onCleanup } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { $currentMap, $mapTargetLayer } from '@/store/mapleMap';

import type { Container, Application } from 'pixi.js';
import type { ZoomContainer } from '@/renderer/ZoomContainer';
import { MapleMap } from '@/renderer/map/map';

/* component hook */
export interface UseMapleMapProps {
  viewport: Accessor<ZoomContainer | undefined>;
  isInit: Accessor<boolean>;
  application: Application;
  singleTarget: Container;
}
export function MapleMapMount(props: UseMapleMapProps) {
  const currentMap = useStore($currentMap);
  const targetLayer = useStore($mapTargetLayer);

  let map: MapleMap | undefined;

  createEffect(async () => {
    const app = props.application;
    const viewport = props.viewport();
    const isInit = props.isInit();
    const mapData = currentMap();
    if (!isInit || !app || !viewport || !mapData) {
      return;
    }
    if (map && map.id === mapData.id) {
      return;
    }
    map?.destroy();
    map = new MapleMap(mapData.id, app.renderer, viewport);
    await map.load();

    viewport.worldWidth = map.edge.width;
    viewport.worldHeight = map.edge.height;
    viewport.clamp({
      top: map.edge.x,
      bottom: map.edge.bottom,
      left: map.edge.y,
      right: map.edge.right,
    });
    const layer = $mapTargetLayer.get() + 1;
    map.layers[layer].addChild(props.singleTarget);
    viewport.addChild(map);
  });

  createEffect(() => {
    const layer = targetLayer() + 1;
    if (map) {
      map.layers[layer].addChild(props.singleTarget);
    }
  });

  onCleanup(() => {
    const viewport = props.viewport();
    map?.destroy();
    map = undefined;
    viewport?.addChild(props.singleTarget);
    props.singleTarget.position.set(0, 0);
  });

  return null;
}
