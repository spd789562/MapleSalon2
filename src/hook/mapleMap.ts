import { type Accessor, createEffect, onCleanup, untrack } from 'solid-js';
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
  singleTarget: Accessor<Container>;
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
    const target = untrack(() => props.singleTarget());
    target.removeFromParent();
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
    target.zIndex = 99999999;
    map.layers[layer].addChild(target);
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
    const target = untrack(() => props.singleTarget());
    if (map) {
      map.layers[layer].addChild(target);
    }
  });

  createEffect(() => {
    const x = targetPosX();
    const y = targetPosY();
    const target = untrack(() => props.singleTarget());
    target.position.set(x, y);
  });

  createEffect(() => {
    const target = props.singleTarget();
    if (map) {
      const layer = $mapTargetLayer.get() + 1;
      target.zIndex = 99999999;
      map.layers[layer].addChild(target);
      const x = $mapTargetPosX.get();
      const y = $mapTargetPosY.get();
      target.position.set(x, y);
    }
  });

  onCleanup(() => {
    const viewport = props.viewport();
    const target = untrack(() => props.singleTarget());
    map?.destroy();
    map = undefined;
    if (viewport) {
      viewport.addChild(target);
      viewport.hasMap = false;
      viewport.moveCenter(0, 0);
    }
    target.position.set(0, 0);
  });

  return null;
}
