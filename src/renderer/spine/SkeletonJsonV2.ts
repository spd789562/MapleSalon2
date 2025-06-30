import {
  type AttachmentLoader,
  type MeshAttachment,
  type VertexAttachment,
  type Attachment,
  BoneData,
  Inherit,
  IkConstraintData,
  SkeletonData,
  Skin,
  SlotData,
  BlendMode,
  Utils,
  Color,
  type NumberArrayLike,
  type Timeline,
  Animation,
  AttachmentTimeline,
  RGBATimeline,
  RGBA2Timeline,
  RotateTimeline,
  TranslateTimeline,
  ScaleTimeline,
  ShearTimeline,
  IkConstraintTimeline,
  DeformTimeline,
  DrawOrderTimeline,
  EventTimeline,
  type CurveTimeline2,
  type CurveTimeline,
  EventData,
  Event,
} from '@esotericsoftware/spine-pixi-v8';
import { Sequence } from '@esotericsoftware/spine-core/dist/attachments/Sequence';

export class SkeletonJsonV2 {
  attachmentLoader: AttachmentLoader;

  scale = 1;
  private linkedMeshes = [] as LinkedMesh[];

  constructor(attachmentLoader: AttachmentLoader) {
    this.attachmentLoader = attachmentLoader;
  }

  readSkeletonData(json: string): SkeletonData {
    const skeletonData = new SkeletonData();
    const root = JSON.parse(json);
    const skeletonMap = root.skeleton;
    if (skeletonMap) {
      skeletonData.hash = skeletonMap.hash;
      skeletonData.version = skeletonMap.spine;
      skeletonData.width = skeletonMap.width;
      skeletonData.height = skeletonMap.height;
      skeletonData.fps = skeletonMap.fps;
    }
    if (root.bones) {
      this.readBones(root, skeletonData);
    }
    if (root.slots) {
      this.readSlots(root, skeletonData);
    }
    if (root.ik) {
      this.readIkConstraint(root, skeletonData);
    }
    if (root.skins) {
      this.readSkin(root, skeletonData);
    }
    if (root.events) {
      this.readEvents(root, skeletonData);
    }
    if (root.animations) {
      for (const [animationName, animationMap] of Object.entries(
        root.animations as Record<string, any>,
      )) {
        this.readAnimation(animationMap, animationName, skeletonData);
      }
    }

    return skeletonData;
  }
  readBones(root: any, skeletonData: SkeletonData) {
    let i = 0;
    for (const boneDataMap of root.bones) {
      let parent: BoneData | null = null;
      const parentName = getValue(boneDataMap, 'parent', null);
      if (parentName) {
        parent = skeletonData.findBone(parentName);
        if (!parent) {
          throw new Error(`Parent bone not found: ${parentName}`);
        }
      }
      const data = new BoneData(i, boneDataMap.name, parent);
      data.length = getValue(boneDataMap, 'length', 0) * this.scale;
      data.x = getValue(boneDataMap, 'x', 0) * this.scale;
      data.y = getValue(boneDataMap, 'y', 0) * this.scale;
      data.rotation = getValue(boneDataMap, 'rotation', 0);
      data.scaleX = getValue(boneDataMap, 'scaleX', 1);
      data.scaleY = getValue(boneDataMap, 'scaleY', 1);
      data.shearX = getValue(boneDataMap, 'shearX', 0);
      data.shearY = getValue(boneDataMap, 'shearY', 0);
      data.inherit = Utils.enumValue(
        Inherit,
        getValue(boneDataMap, 'inherit', 'Normal'),
      );
      data.skinRequired = getValue(boneDataMap, 'skin', false);
      const color = getValue(boneDataMap, 'color', null);
      color && data.color.setFromString(color);
      if (getValue(boneDataMap, 'flipX', false)) {
        data.scaleX = -data.scaleX;
      }
      if (getValue(boneDataMap, 'flipY', false)) {
        data.scaleY = -data.scaleY;
      }
      skeletonData.bones.push(data);
      i += 1;
    }
  }
  readSlots(root: any, skeletonData: SkeletonData) {
    let i = 0;
    for (const slotMap of root.slots) {
      const slotName = slotMap.name;
      const boneData = skeletonData.findBone(slotMap.bone);
      if (!boneData) {
        throw new Error(
          `Couldn't find bone ${slotMap.bone} for slot ${slotName}`,
        );
      }
      const data = new SlotData(i, slotName, boneData);
      const color = getValue(slotMap, 'color', null);
      color && data.color.setFromString(color);
      const dark = getValue(slotMap, 'dark', null);
      if (dark) {
        data.darkColor = Color.fromString(dark);
      }
      data.attachmentName = getValue(slotMap, 'attachment', null);
      data.blendMode = Utils.enumValue(
        BlendMode,
        getValue(slotMap, 'blend', 'normal'),
      );
      data.visible = getValue(slotMap, 'visible', true);
      skeletonData.slots.push(data);
      i += 1;
    }
  }
  readIkConstraint(root: any, skeletonData: SkeletonData) {
    const constraintNames = Object.keys(root.ik);
    for (let i = 0; i < constraintNames.length; i++) {
      const constraintMap = root.ik[i];
      const constraintName = constraintMap.name;
      const data = new IkConstraintData(constraintName);
      data.order = getValue(constraintMap, 'order', i);
      data.skinRequired = false;
      data.bendDirection = getValue(constraintMap, 'bendPositive', true)
        ? 1
        : -1;
      data.mix = getValue(constraintMap, 'mix', 1);
      data.softness = getValue(constraintMap, 'softness', 0) * this.scale;
      const target = skeletonData.findBone(constraintMap.target);
      if (!target) {
        throw new Error(
          `Couldn't find target bone ${constraintMap.target} for IK constraint ${constraintName}`,
        );
      }
      data.target = target;

      const bones = constraintMap.bones || [];
      for (const bone of bones) {
        const b = skeletonData.findBone(bone);
        if (!b) {
          throw new Error(
            `Couldn't find bone ${bone} for IK constraint ${constraintName}`,
          );
        }
        data.bones.push(b);
      }
      skeletonData.ikConstraints.push(data);
    }
  }
  readSkin(root: any, skeletonData: SkeletonData) {
    for (const [skinName, skinMap] of Object.entries(
      root.skins as Record<string, any>,
    )) {
      const skin = new Skin(skinName);
      for (const [slotName, slotMap] of Object.entries(
        skinMap as Record<string, any>,
      )) {
        const slot = skeletonData.findSlot(slotName);
        if (!slot) {
          throw new Error(`Slot not found: ${slotName} for skin ${skinName}`);
        }
        for (const [attachmentName, attachmentMap] of Object.entries(slotMap)) {
          const attachment = this.readAttachment(
            attachmentMap,
            skin,
            slot.index,
            attachmentName,
          );
          if (attachment) {
            skin.setAttachment(slot.index, attachmentName, attachment);
          }
        }
      }
      skeletonData.skins.push(skin);
      if (skin.name === 'default') {
        skeletonData.defaultSkin = skin;
      }
    }
  }
  readEvents(root: any, skeletonData: SkeletonData) {
    for (const [eventName, eventMap] of Object.entries(
      root.events as Record<string, any>,
    )) {
      const data = new EventData(eventName);
      data.intValue = getValue(eventMap, 'int', 0);
      data.floatValue = getValue(eventMap, 'float', 0);
      data.stringValue = getValue(eventMap, 'string', '');
      skeletonData.events.push(data);
    }
  }
  readAnimation(map: any, name: string, skeletonData: SkeletonData) {
    const scale = this.scale;
    const timelines: Timeline[] = [];
    if (map.slots) {
      for (const [slotName, slotMap] of Object.entries(
        map.slots as Record<string, any>,
      )) {
        if (!slotMap) {
          continue;
        }
        this.readSlotTimeline(slotMap, slotName, skeletonData, timelines);
      }
    }
    if (map.bones) {
      for (const [boneName, boneMap] of Object.entries(
        map.bones as Record<string, any>,
      )) {
        if (!boneMap) {
          continue;
        }
        this.readBoneTimeline(boneMap, boneName, skeletonData, timelines);
      }
    }
    if (map.ik) {
      for (const [ikName, ikMap] of Object.entries(
        map.ik as Record<string, any>,
      )) {
        if (!ikMap) {
          continue;
        }
        this.readIkConstraintTimeline(ikMap, ikName, skeletonData, timelines);
      }
    }
    if (map.ffd) {
      for (const [skinName, skinMap] of Object.entries(
        map.ffd as Record<string, any>,
      )) {
        if (!skinMap) {
          continue;
        }
        this.readDeformTimeline(skinMap, skinName, skeletonData, timelines);
      }
    }
    if (map.drawOrder) {
      timelines.push(this.readDrawOrderTimeline(map.drawOrder, skeletonData));
    }
    if (map.event) {
      timelines.push(this.readEventTimeline(map.event, skeletonData));
    }
    let duration = 0;
    for (const timeline of timelines) {
      duration = Math.max(duration, timeline.getDuration());
    }
    const animation = new Animation(name, timelines, duration);
    skeletonData.animations.push(animation);
  }
  readSlotTimeline(
    map: any,
    name: string,
    skeletonData: SkeletonData,
    timelines: Timeline[],
  ) {
    const slot = skeletonData.findSlot(name);
    if (!slot) {
      throw new Error(`Slot not found: ${name}`);
    }
    const slotIndex = slot.index;
    for (const [timelineName, timelineMap] of Object.entries(
      map as Record<string, any>,
    )) {
      if (!timelineMap) {
        continue;
      }
      const frames = timelineMap as any[];
      if (timelineName === 'attachment') {
        const timeline = new AttachmentTimeline(frames.length, slotIndex);
        for (let frame = 0; frame < frames.length; frame++) {
          const frameMap = frames[frame];
          timeline.setFrame(
            frame,
            getValue(frameMap, 'time', 0),
            frameMap.name ?? null,
          );
        }
        timelines.push(timeline);
      } else if (timelineName === 'color') {
        const timeline = new RGBATimeline(
          frames.length,
          frames.length << 2,
          slotIndex,
        );
        let prevMap = frames[0];
        let prevTime = getValue(prevMap, 'time', 0);
        let prevColor = Color.fromString(prevMap.color);
        for (let frame = 0, bezier = 0; ; frame++) {
          timeline.setFrame(
            frame,
            prevTime,
            prevColor.r,
            prevColor.g,
            prevColor.b,
            prevColor.a,
          );
          const nextMap = frames[frame + 1];
          if (!nextMap) {
            timeline.shrink(bezier);
            break;
          }
          const time = getValue(nextMap, 'time', 0);
          const color = Color.fromString(nextMap.color);
          const curve = prevMap.curve;
          if (curve) {
            // biome-ignore format: it easier to read this way, skip
            bezier = readCurve2(curve, timeline, bezier, frame, 0, 0, prevTime, time, prevColor.r, color.r, 1);
            // biome-ignore format: skip
            bezier = readCurve2(curve, timeline, bezier, frame, 0, 1, prevTime, time, prevColor.g, color.g, 1);
            // biome-ignore format: skip
            bezier = readCurve2(curve, timeline, bezier, frame, 0, 2, prevTime, time, prevColor.b, color.b, 1);
            // biome-ignore format: skip
            bezier = readCurve2(curve, timeline, bezier, frame, 0, 3, prevTime, time, prevColor.a, color.a, 1);
          }
          prevTime = time;
          prevColor = color;
          prevMap = nextMap;
        }
        timelines.push(timeline);
      } else if (timelineName === 'twoColor') {
        const timeline = new RGBA2Timeline(
          frames.length,
          frames.length * 7,
          slotIndex,
        );
        let prevMap = frames[0];
        let prevTime = getValue(prevMap, 'time', 0);
        let prevLight = Color.fromString(prevMap.light);
        let prevDark = Color.fromString(prevMap.dark);
        for (let frame = 0, bezier = 0; ; frame++) {
          timeline.setFrame(
            frame,
            prevTime,
            prevLight.r,
            prevLight.g,
            prevLight.b,
            prevLight.a,
            prevDark.r,
            prevDark.g,
            prevDark.b,
          );
          const nextMap = frames[frame + 1];
          if (!nextMap) {
            timeline.shrink(bezier);
            break;
          }
          const time = getValue(nextMap, 'time', 0);
          const light = Color.fromString(nextMap.light);
          const dark = Color.fromString(nextMap.dark);
          const curve = prevMap.curve;
          if (curve) {
            // biome-ignore format: it easier to read this way, skip
            bezier = readCurve2(curve, timeline, bezier, frame, 0, 0, prevTime, time, prevLight.r, light.r, 1);
            // biome-ignore format: skip
            bezier = readCurve2(curve, timeline, bezier, frame, 0, 1, prevTime, time, prevLight.g, light.g, 1);
            // biome-ignore format: skip
            bezier = readCurve2(curve, timeline, bezier, frame, 0, 2, prevTime, time, prevLight.b, light.b, 1);
            // biome-ignore format: skip
            bezier = readCurve2(curve, timeline, bezier, frame, 0, 3, prevTime, time, prevLight.a, light.a, 1);
            // biome-ignore format: skip
            bezier = readCurve2(curve, timeline, bezier, frame, 0, 4, prevTime, time, prevDark.r, dark.r, 1);
            // biome-ignore format: skip
            bezier = readCurve2(curve, timeline, bezier, frame, 0, 5, prevTime, time, prevDark.g, dark.g, 1);
            // biome-ignore format: skip
            bezier = readCurve2(curve, timeline, bezier, frame, 0, 6, prevTime, time, prevDark.b, dark.b, 1);
          }
          prevTime = time;
          prevLight = light;
          prevDark = dark;
          prevMap = nextMap;
        }
        timelines.push(timeline);
      }
    }
  }
  readBoneTimeline(
    map: any,
    name: string,
    skeletonData: SkeletonData,
    timelines: Timeline[],
  ) {
    const bone = skeletonData.findBone(name);
    if (!bone) {
      throw new Error(`Bone not found: ${name} when reading bone timeline`);
    }
    const boneIndex = bone.index;
    for (const [timelineName, timelineMap] of Object.entries(
      map as Record<string, any[]>,
    )) {
      const frames = timelineMap.length;
      if (!frames) {
        continue;
      }
      if (timelineName === 'rotate') {
        const timeline = new RotateTimeline(frames, frames, boneIndex);
        let prevMap = timelineMap[0];
        let prevAngle = getValue(prevMap, 'angle', 0);
        let prevTime = getValue(prevMap, 'time', 0);
        for (let frame = 0, bezier = 0; ; frame++) {
          timeline.setFrame(frame, prevTime, prevAngle);
          const nextMap = timelineMap[frame + 1];
          if (!nextMap) {
            timeline.shrink(bezier);
            break;
          }
          const time = getValue(nextMap, 'time', 0);
          // not sure it's correct, but some time the map give the angle above 360 it's looks wrong
          const angle = getValue(nextMap, 'angle', 0) % 360;
          const curve = prevMap.curve;
          if (curve) {
            // biome-ignore format: skip
            bezier = readCurve2(curve, timeline, bezier, frame, 0, 0, prevTime, time, prevAngle, angle, 1);
          }
          prevTime = time;
          prevAngle = angle;
          prevMap = nextMap;
        }

        timelines.push(timeline);
      } else if (timelineName === 'translate') {
        const timeline = readTimeline2(
          timelineMap,
          new TranslateTimeline(frames, frames << 1, boneIndex),
          'x',
          'y',
          0,
          this.scale,
        );
        timelines.push(timeline);
      } else if (timelineName === 'shear') {
        const timeline = readTimeline2(
          timelineMap,
          new ShearTimeline(frames, frames << 1, boneIndex),
          'x',
          'y',
          0,
          1,
        );

        timelines.push(timeline);
      } else if (timelineName === 'scale') {
        const timeline = readTimeline2(
          timelineMap,
          new ScaleTimeline(frames, frames << 1, boneIndex),
          'x',
          'y',
          1,
          1,
        );
        timelines.push(timeline);
      }
    }
  }
  readIkConstraintTimeline(
    map: any,
    name: string,
    skeletonData: SkeletonData,
    timelines: Timeline[],
  ) {
    const constraint = skeletonData.findIkConstraint(name);
    if (!constraint) {
      throw new Error(`IK constraint not found: ${name}`);
    }
    const constraintIndex = skeletonData.ikConstraints.indexOf(constraint);
    const timeline = new IkConstraintTimeline(
      map.length,
      map.length << 1,
      constraintIndex,
    );

    let prevMap = map[0];
    let prevTime = getValue(prevMap, 'time', 0);
    let prevMix = getValue(prevMap, 'mix', 1);
    const softness = 0;
    for (let frame = 0, bezier = 0; ; frame++) {
      timeline.setFrame(
        frame,
        prevTime,
        prevMix,
        softness,
        getValue(prevMap, 'bendPositive', true) ? 1 : -1,
        false,
        false,
      );
      const nextMap = map[frame + 1];
      if (!nextMap) {
        timeline.shrink(bezier);
        break;
      }
      const time = getValue(nextMap, 'time', 0);
      const mix = getValue(nextMap, 'mix', 1);
      const curve = prevMap.curve;
      if (curve) {
        // biome-ignore format: skip
        bezier = readCurve2(curve, timeline, bezier, frame, 0, 0, prevTime, time, prevMix, mix, 1);
      }
      prevTime = time;
      prevMix = mix;
      prevMap = nextMap;
    }
    timelines.push(timeline);
  }
  /* aka attachment timeline */
  readDeformTimeline(
    map: any,
    name: string,
    skeletonData: SkeletonData,
    timelines: Timeline[],
  ) {
    const skin = skeletonData.findSkin(name);
    if (!skin) {
      throw new Error(`Skin not found: ${name}`);
    }
    for (const [slotName, slotMap] of Object.entries(
      map as Record<string, any>,
    )) {
      const slot = skeletonData.findSlot(slotName);
      if (!slot) {
        throw new Error(`Slot not found: ${slotName}`);
      }
      const slotIndex = slot.index;
      for (const [attachmentName, attachmentMap] of Object.entries(
        slotMap as Record<string, any>,
      )) {
        const attachment = skin.getAttachment(
          slotIndex,
          attachmentName,
        ) as VertexAttachment;
        if (!attachment) {
          throw new Error(`Attachment not found: ${attachmentName}`);
        }
        const weighted = attachment.bones !== null;
        const vertices = attachment.vertices;
        const deformLength = weighted
          ? (vertices.length / 3) * 2
          : vertices.length;
        const frames = attachmentMap.length;
        const timeline = new DeformTimeline(
          frames,
          frames,
          slotIndex,
          attachment,
        );
        let prevMap = attachmentMap[0];
        let prevTime = getValue(prevMap, 'time', 0);
        for (let frame = 0, bezier = 0; ; frame++) {
          let deform: NumberArrayLike;
          const verticesValue = getValue(prevMap, 'vertices', null);
          if (verticesValue) {
            deform = Utils.newFloatArray(deformLength);
            const start = getValue(prevMap, 'offset', 0);
            Utils.arrayCopy(
              verticesValue,
              0,
              deform,
              start,
              verticesValue.length,
            );
            if (this.scale !== 1) {
              for (
                let i = start, n = start + verticesValue.length;
                i < n;
                i++
              ) {
                deform[i] *= this.scale;
              }
            }
            if (!weighted) {
              for (let i = 0; i < deformLength; i++) {
                deform[i] += vertices[i];
              }
            }
          } else {
            deform = weighted ? Utils.newFloatArray(deformLength) : vertices;
          }

          timeline.setFrame(frame, prevTime, deform);
          const nextMap = attachmentMap[frame + 1];
          if (!nextMap) {
            timeline.shrink(bezier);
            break;
          }
          const time = getValue(nextMap, 'time', 0);
          const curve = prevMap.curve;
          if (curve) {
            // biome-ignore format: skip
            bezier = readCurve2(curve, timeline, bezier, frame, 0, 0, prevTime, time, 0, 1, 1);
          }
          prevTime = time;
          prevMap = nextMap;
        }
        timelines.push(timeline);
      }
    }
  }
  readDrawOrderTimeline(map: any[], skeletonData: SkeletonData) {
    const timeline = new DrawOrderTimeline(map.length);
    const slotCount = skeletonData.slots.length;
    let frame = 0;
    for (const drawOrderMap of map) {
      let drawOrder: number[] = [];
      const offsets = getValue(drawOrderMap, 'offsets', null);
      if (offsets) {
        drawOrder = Utils.newArray(slotCount, -1);
        const unchanged = Utils.newArray(slotCount - offsets.length, -1);
        let originalIndex = 0;
        let unchangedIndex = 0;
        for (const offsetMap of offsets) {
          const slot = skeletonData.findSlot(offsetMap.slot);
          if (!slot) {
            throw new Error(`Slot not found: ${offsetMap.slot}`);
          }
          const slotIndex = slot.index;
          while (originalIndex !== slotIndex) {
            unchanged[unchangedIndex++] = originalIndex++;
          }
          drawOrder[originalIndex + offsetMap.offset] = originalIndex++;
        }
        while (originalIndex < slotCount) {
          unchanged[unchangedIndex++] = originalIndex++;
        }
        for (let i = slotCount - 1; i >= 0; i--) {
          if (drawOrder[i] === -1) {
            drawOrder[i] = unchanged[--unchangedIndex];
          }
        }
      }
      timeline.setFrame(frame++, drawOrderMap.time, drawOrder);
    }
    return timeline;
  }
  readEventTimeline(map: any[], skeletonData: SkeletonData) {
    const timeline = new EventTimeline(map.length);
    let frame = 0;
    for (const eventMap of map) {
      const eventData = skeletonData.findEvent(eventMap.name);
      if (!eventData) {
        throw new Error(`Event not found: ${eventMap.name}`);
      }
      const event = new Event(
        Utils.toSinglePrecision(getValue(eventMap, 'time', 0)),
        eventData,
      );
      event.intValue = getValue(eventMap, 'int', eventData.intValue);
      event.floatValue = getValue(eventMap, 'float', eventData.floatValue);
      event.stringValue = getValue(eventMap, 'string', eventData.stringValue);
      timeline.setFrame(frame++, event);
    }
    return timeline;
  }

  readAttachment(
    map: any,
    skin: Skin,
    slotIndex: number,
    n: string,
  ): Attachment | null {
    const scale = this.scale;
    const name = getValue(map, 'name', n);
    const color: string = getValue(map, 'color', null);

    switch (getValue(map, 'type', 'region')) {
      case 'region': {
        const path = getValue(map, 'path', name);
        const sequence = this.readSequence(getValue(map, 'sequence', null));
        const region = this.attachmentLoader.newRegionAttachment(
          skin,
          name,
          path,
          sequence,
        );
        if (!region) {
          return null;
        }
        region.path = path;
        region.x = getValue(map, 'x', 0) * scale;
        region.y = getValue(map, 'y', 0) * scale;
        region.scaleX = getValue(map, 'scaleX', 1);
        region.scaleY = getValue(map, 'scaleY', 1);
        region.rotation = getValue(map, 'rotation', 0);
        region.width = map.width * scale;
        region.height = map.height * scale;
        region.sequence = sequence;

        color && region.color.setFromString(color);

        region.region && region.updateRegion();
        return region;
      }
      case 'boundingbox': {
        const box = this.attachmentLoader.newBoundingBoxAttachment(skin, name);
        if (!box) {
          return null;
        }
        this.readVertices(map, box, map.vertexCount << 1);
        color && box.color.setFromString(color);
        return box;
      }
      case 'mesh':
      case 'weightedmesh':
      case 'skinnedmesh':
      case 'linkedmesh': {
        const path = getValue(map, 'path', name);
        const sequence = this.readSequence(getValue(map, 'sequence', null));
        const mesh = this.attachmentLoader.newMeshAttachment(
          skin,
          name,
          path,
          sequence,
        );
        if (!mesh) {
          return null;
        }
        mesh.path = path;

        color && mesh.color.setFromString(color);

        mesh.width = getValue(map, 'width', 0) * scale;
        mesh.height = getValue(map, 'height', 0) * scale;
        mesh.sequence = sequence;

        const parent: string = getValue(map, 'parent', null);
        if (parent) {
          this.linkedMeshes.push(
            new LinkedMesh(
              mesh,
              getValue(map, 'skin', null) as string,
              slotIndex,
              parent,
              getValue(map, 'timelines', true),
            ),
          );
          return mesh;
        }

        const uvs = map.uvs as number[];
        this.readVertices(map, mesh, uvs.length);
        mesh.triangles = map.triangles as number[];
        mesh.regionUVs = uvs;
        mesh.region && mesh.updateRegion();

        mesh.edges = getValue(map, 'edges', null);
        mesh.hullLength = getValue(map, 'hull', 0) * 2;
        return mesh;
      }
      // skip path, point, clipping
      default:
        break;
    }
    return null;
  }
  readSequence(map: any) {
    if (map == null) return null;
    const sequence = new Sequence(getValue(map, 'count', 0));
    sequence.start = getValue(map, 'start', 1);
    sequence.digits = getValue(map, 'digits', 0);
    sequence.setupIndex = getValue(map, 'setup', 0);
    return sequence;
  }
  readVertices(map: any, attachment: VertexAttachment, verticesLength: number) {
    const scale = this.scale;
    attachment.worldVerticesLength = verticesLength;
    const vertices: number[] = map.vertices;
    if (verticesLength === vertices.length) {
      const scaledVertices = Utils.toFloatArray(vertices);
      if (scale !== 1) {
        for (let i = 0, n = vertices.length; i < n; i++) {
          scaledVertices[i] *= scale;
        }
      }
      attachment.vertices = scaledVertices;
      return;
    }
    const weights: number[] = [];
    const bones: number[] = [];
    for (let i = 0, n = vertices.length; i < n; ) {
      const boneCount = vertices[i++];
      bones.push(boneCount);
      for (let nn = i + boneCount * 4; i < nn; i += 4) {
        bones.push(vertices[i]);
        weights.push(vertices[i + 1] * scale);
        weights.push(vertices[i + 2] * scale);
        weights.push(vertices[i + 3]);
      }
    }
    attachment.bones = bones;
    attachment.vertices = Utils.toFloatArray(weights);
  }
}

class LinkedMesh {
  parent: string;
  skin: string;
  slotIndex: number;
  mesh: MeshAttachment;
  inheritTimeline: boolean;

  constructor(
    mesh: MeshAttachment,
    skin: string,
    slotIndex: number,
    parent: string,
    inheritDeform: boolean,
  ) {
    this.mesh = mesh;
    this.skin = skin;
    this.slotIndex = slotIndex;
    this.parent = parent;
    this.inheritTimeline = inheritDeform;
  }
}

// reading timeline from two fields
export function readTimeline2(
  keys: any[],
  timeline: CurveTimeline2,
  name1: string,
  name2: string,
  defaultValue: number,
  scale: number,
) {
  let keyMap = keys[0];
  let time = getValue(keyMap, 'time', 0);
  let value1 = getValue(keyMap, name1, defaultValue) * scale;
  let value2 = getValue(keyMap, name2, defaultValue) * scale;
  let bezier = 0;
  for (let frame = 0; ; frame++) {
    timeline.setFrame(frame, time, value1, value2);
    const nextMap = keys[frame + 1];
    if (!nextMap) {
      timeline.shrink(bezier);
      return timeline;
    }
    const time2 = getValue(nextMap, 'time', 0);
    const nvalue1 = getValue(nextMap, name1, defaultValue) * scale;
    const nvalue2 = getValue(nextMap, name2, defaultValue) * scale;
    const curve = keyMap.curve;
    if (curve) {
      // biome-ignore format: skip
      bezier = readCurve2(curve, timeline, bezier, frame, 0, 0, time, time2, value1, nvalue1, scale);
      // biome-ignore format: skip
      bezier = readCurve2(curve, timeline, bezier, frame, 0, 1, time, time2, value2, nvalue2, scale);
    } else {
      timeline.setLinear(frame);
    }
    time = time2;
    value1 = nvalue1;
    value2 = nvalue2;
    keyMap = nextMap;
  }
}

export function readCurve2(
  curve: 'stepped' | number[],
  timeline: CurveTimeline,
  bezier: number,
  frame: number,
  value: number,
  key: number,
  time1: number,
  time2: number,
  value1: number,
  value2: number,
  scale: number,
) {
  if (curve === 'stepped') {
    timeline.setStepped(frame);
    return bezier;
  }
  const i = value << 2;
  const cx1 = curve[i];
  const cy1 = curve[i + 1] * scale;
  const cx2 = curve[i + 2];
  const cy2 = curve[i + 3] * scale;

  const duration = time2 - time1;
  const valueChange = value2 - value1;
  /**
   * the v2.1's curve is different from the v4.*
   * original curve is [cx1, cy1, cx2, cy2]
   * and cx1, cx2 are the percentage of the duration
   * like if cx1 = 0.3, cx2 = 0.8, duration = 1.5(time2 - time1)
   * cy1, cy2 are the percentage of the value change
   * like if cy1 = 0.3, cy2 = 0.6, valueChange = 10(value2 - value1)
   * the 4.1 curve will end up like [
   *   time1  + duration    * cx1, // 0 + 1.5 * 0.3 = 0.45
   *   value1 + valueChange * cy1, // 0 + 10  * 0.3 = 3
   *   time1  + duration    * cx2, // 0 + 1.5 * 0.8 = 1.2
   *   value1 + valueChange * cy2  // 0 + 10  * 0.6 = 6
   * ]
   * it means in timeline 0 to 1.5, the value will change from 0 to 10
   * and particularly
   * - 0 to 0.45 value change from 0 to 3
   * - 0.45 to 1.2 value change from 3 to 6
   * - 1.2 to 1.5 value change from 6 to 10
   */
  timeline.setBezier(
    bezier,
    frame,
    key,
    time1,
    value1,
    duration * cx1 + time1,
    valueChange * cy1 + value1,
    duration * cx2 + time1,
    valueChange * cy2 + value1,
    time2,
    value2,
  );
  return bezier + 1;
}

export function getValue(map: any, property: string, defaultValue: any) {
  return map[property] !== undefined ? map[property] : defaultValue;
}
