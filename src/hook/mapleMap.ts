import { type Accessor, createEffect, onCleanup } from 'solid-js';
import { useStore } from '@nanostores/solid';

import {
  $currentMap,
  $mapTargetLayer,
  $mapTargetPosX,
  $mapTargetPosY,
  $mapTags,
  $mapBackgroundTags,
  updateMapRect,
  updateMapTargetPos,
  updateMapTags,
} from '@/store/mapleMap';

import type { Container, Application } from 'pixi.js';
import type { ZoomContainer } from '@/renderer/ZoomContainer';
import { MapleMap } from '@/renderer/map/map';

/* component hook */
export interface UseMapleMapProps {
  viewport: Accessor<ZoomContainer | undefined>;
  application: Application;
  singleTarget: Container;
}
export function MapleMapMount(props: UseMapleMapProps) {
  const currentMap = useStore($currentMap);
  const targetLayer = useStore($mapTargetLayer);
  const targetPosX = useStore($mapTargetPosX);
  const targetPosY = useStore($mapTargetPosY);

  const tags = useStore($mapTags);
  const backgroundTags = useStore($mapBackgroundTags);

  let map: MapleMap | undefined;

  createEffect(async () => {
    const app = props.application;
    const viewport = props.viewport();
    const mapData = currentMap();
    if (!app || !viewport || !mapData) {
      return;
    }
    if (map && map.id === mapData.id) {
      return;
    }
    viewport.hasMap = true;
    props.singleTarget.removeFromParent();
    map?.destroy();
    updateMapTags($mapTags, []);
    updateMapTags($mapBackgroundTags, []);
    map = new MapleMap(mapData.id, app.renderer, viewport);
    await map.load();

    viewport.worldWidth = map.edge.width;
    viewport.worldHeight = map.edge.height;
    viewport.clamp({
      top: map.edge.y,
      bottom: map.edge.bottom,
      left: map.edge.x,
      right: map.edge.right,
    });
    updateMapRect(map.edge);
    updateMapTags($mapTags, map.tags);
    updateMapTags($mapBackgroundTags, map.backTags);
    if (map.edge.x > 0 || map.edge.y > 0) {
      const centerX = map.edge.x + map.edge.width / 2;
      const centerY = map.edge.y + map.edge.height / 2;
      viewport.moveCenter(centerX, centerY);
      updateMapTargetPos(centerX, centerY);
    }
    const layer = $mapTargetLayer.get() + 1;
    props.singleTarget.zIndex = 99999999;
    map.layers[layer].addChild(props.singleTarget);
    viewport.addChild(map);
  });

  createEffect(() => {
    const tagList = tags();
    if (map) {
      map.toggleVisibilityByTags(
        tagList.filter((t) => t.disabled).map((t) => t.name),
      );
    }
  });
  createEffect(() => {
    const tagList = backgroundTags();
    if (map) {
      map.toggleVisibilityByTags(
        tagList.filter((t) => t.disabled).map((t) => t.name),
        true,
      );
    }
  });

  createEffect(() => {
    const layer = targetLayer() + 1;
    if (map) {
      map.layers[layer].addChild(props.singleTarget);
    }
  });

  createEffect(() => {
    const x = targetPosX();
    const y = targetPosY();
    props.singleTarget.position.set(x, y);
  });

  onCleanup(() => {
    const viewport = props.viewport();
    map?.destroy();
    map = undefined;
    if (viewport) {
      viewport.addChild(props.singleTarget);
      viewport.hasMap = false;
      viewport.moveCenter(0, 0);
    }
    props.singleTarget.position.set(0, 0);
  });

  return null;
}
